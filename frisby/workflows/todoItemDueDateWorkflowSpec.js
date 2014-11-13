var frisby = require('frisby');

frisby.create('Obtain token')
	.get('https://todo.ly/api/authentication/token.json', {
		headers: {
			Authorization: 'Basic bHVpZ2xtQG91dGxvb2suY29tOkNvbnRyb2wxMjM='
		},
			json: true
			//inspectOnFailure: true

	})
	.expectStatus(200)
	
	.afterJSON(function(data){
		
		frisby.globalSetup({
			request: {
				headers: {
					token: data.TokenString
				},
			json: true
			//inspectOnFailure: true

			}
		})
	
		frisby.create('Get all projects and obtain the Id of the first one')
		.get('https://todo.ly/api/projects.json')
		.expectStatus(200)
		
		.afterJSON(function(projectData){

			projectId = projectData[0].Id;

			frisby.create('Create a new item in the selected project and verify Due Date is empty')
			.post('https://todo.ly/api/items.json', {
				Content: "My Test Item DueDate",
				ProjectId: projectId
			})
			.expectStatus(200)
			.expectJSON({
				Content: "My Test Item DueDate",
				ProjectId: projectId
			})

			.afterJSON(function(itemData){

				itemId = itemData.Id;
				dueDateItem = new Date().getTime();
				dueDateTime = '/Date(' + dueDateItem + ')/';
				expect(itemData.DueDate).toBe("");
				expect(itemData.DueDateTime).toBe(null);

				frisby.create('Update Due Date Time and verify Created Date and Last Updated Date are not the same')
				.put('https://todo.ly/api/items/' + itemId + '.json', {
					DueDateTime: dueDateTime
				})
				.expectStatus(200)

				.afterJSON(function(updatedItem){
					expect(updatedItem.CreatedDate).not.toEqual(updatedItem.LastUpdatedDate);
					expect(updatedItem.DueDate).not.toBe("");
					expect(updatedItem.DueDateTime).not.toBe(null);
				})

				.toss()
			
				frisby.create('Delete created item')
				.delete('https://todo.ly/api/items/' + itemId + '.json')
				.expectStatus(200)
				.expectJSON({ 
					Deleted: true 
				})
				.toss()

			})
			.toss()

		})
		.toss()

	})
.toss()