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

			frisby.create('Create a new item in the selected project and verify DueDateTime is null')
			.post('https://todo.ly/api/items.json', {
				Content: "My Test Item Today",
				ProjectId: projectId
			})
			.expectStatus(200)
			.expectJSON({
				Content: "My Test Item Today",
				ProjectId: projectId
			})

			.afterJSON(function(itemData){

				itemTodayId = itemData.Id;
				dueDateItem = new Date().getTime() - 86400000;
				dueDateTime = '/Date(' + dueDateItem + ')/';
				expect(itemData.DueDateTime).toBe(null);

				frisby.create('Update Due Date Time with and overdued date')
				.put('https://todo.ly/api/items/' + itemTodayId + '.json', {
					DueDateTime: dueDateTime
				})
				.expectStatus(200)

				.afterJSON(function(updatedItem){
					expect(updatedItem.DueDateTime).not.toBe(null);
				})

				.toss()

				frisby.create('Obtain Id for Today Filter')
				.get('https://todo.ly/api/filters.json')
				.expectStatus(200)

				.afterJSON(function(filterList){
				
					for (var i = 0; i < filterList.length; i++) {
						if (filterList[i].Content == "Today") {
							todayId = filterList[i].Id
						}
					}
					
					frisby.create('Verify Today filter includes the test item')
					.get('https://todo.ly/api/filters/' + todayId + '/items.json')
					.expectStatus(200)
					.expectJSON('?', {
						Content: "My Test Item Today"
					})
					.afterJSON(function(data){

						frisby.create('Delete created item')
						.delete('https://todo.ly/api/items/' + itemTodayId + '.json')
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