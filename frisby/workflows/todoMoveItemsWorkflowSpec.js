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

			var projectId1 = projectData[0].Id;
			var projectId2 = projectData[1].Id;

			frisby.create('Create a new item in the selected project')
			.post('https://todo.ly/api/items.json', {
				Content: "My Test Item Move",
				ProjectId: projectId1
			})
			.expectStatus(200)
			.expectJSON({
				Content: "My Test Item Move",
				ProjectId: projectId1
			})

			.afterJSON(function(itemData){

				itemId = itemData.Id;

				frisby.create('Verify the item is listed in the project where we have created it')
				.get('https://todo.ly/api/projects/' + projectId1 + '/items.json')
				.expectStatus(200)
				.expectJSON('?', {
					Id: itemId,
					ProjectId: projectId1
				})
				.toss()

				frisby.create('Move Item to the other project')
				.put('https://todo.ly/api/items/' + itemId + '.json', {
					ProjectId: projectId2
				})
				.expectStatus(200)
				.expectJSON({
					ProjectId: projectId2
				})
				.toss()

				frisby.create('Verify the item is listed in the second project ater moving it')
				.get('https://todo.ly/api/projects/' + projectId2 + '/items.json')
				.expectStatus(200)
				.expectJSON('?', {
					Id: itemId,
					ProjectId: projectId2
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