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

			projectId = projectData[1].Id;

			frisby.create('Create a new item in the selected project')
			.post('https://todo.ly/api/items.json', {
				Content: "My Test Item",
				ProjectId: projectId
			})
			.expectStatus(200)
			.expectJSON({
				Content: "My Test Item",
				ProjectId: projectId
			})

			.afterJSON(function(itemData){

				itemId = itemData.Id;
				itemProjectId = itemData.ProjectId;

				frisby.create('Verify the item is listed in the project where we have created it')
				.get('https://todo.ly/api/projects/' + itemProjectId + '/items.json')
				.expectStatus(200)
				.expectJSON('?', {
					Id: itemId,
					ProjectId: itemProjectId
				})
				.toss()

				frisby.create('Update created item and verify changes are properly reflected')
				.put('https://todo.ly/api/items/' + itemId + '.json', {
					Content : "My Updated Test Item"
				})
				.expectStatus(200)
				.expectJSON({
					Content : "My Updated Test Item"
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