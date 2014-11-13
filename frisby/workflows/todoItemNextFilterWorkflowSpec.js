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
	
		frisby.create('Get all projects and obtain the Id of the second one')
		.get('https://todo.ly/api/projects.json')
		.expectStatus(200)
		
		.afterJSON(function(projectData){

			projectId = projectData[1].Id;

			frisby.create('Create a new item in the selected project and verify DueDateTime is null')
			.post('https://todo.ly/api/items.json', {
				Content: "My Test Item Next",
				ProjectId: projectId
			})
			.expectStatus(200)
			.expectJSON({
				Content: "My Test Item Next",
				ProjectId: projectId
			})

			.afterJSON(function(itemData){

				itemNextId = itemData.Id;
				dueDateItem = new Date().getTime() + 86400000;
				dueDateTime = '/Date(' + dueDateItem + ')/';
				expect(itemData.DueDateTime).toBe(null);

				frisby.create('Update Due Date Time with a future date')
				.put('https://todo.ly/api/items/' + itemNextId + '.json', {
					DueDateTime: dueDateTime
				})
				.expectStatus(200)

				.afterJSON(function(updatedItem){
					expect(updatedItem.DueDateTime).not.toBe(null);
				})

				.toss()

				frisby.create('Obtain Id for Next Filter')
				.get('https://todo.ly/api/filters.json')
				.expectStatus(200)

				.afterJSON(function(filterList){
				
					for (var i = 0; i < filterList.length; i++) {
						if (filterList[i].Content == "Next") {
							nextId = filterList[i].Id
						}
					}

					frisby.create('Verify Today filter includes the test item')
					.get('https://todo.ly/api/filters/' + nextId + '/items.json')
					.expectStatus(200)
					.expectJSON('?', {
						Content: "My Test Item Next"
					})
					.afterJSON(function(data){

						frisby.create('Delete created item')
						.delete('https://todo.ly/api/items/' + itemNextId + '.json')
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

		})
		.toss()

	})
.toss()