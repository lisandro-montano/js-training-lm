var frisby = require('frisby');

frisby.create('Obtain token for smoke tests')
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

		frisby.create('Get all projects from specific account')
		.get('https://todo.ly/api/projects.json')
		.expectStatus(200)

		.afterJSON(function(projectData){

			projectId = projectData[0].Id

			frisby.create('Get project by id')
			.get('https://todo.ly/api/projects/' + projectId + '.json')
			.expectStatus(200)

			.toss();

		})
		
		.toss();

		frisby.create('Get all items from specific account')
		.get('https://todo.ly/api/items.json')
		.expectStatus(200)
		
		.toss();

		frisby.create('Get information from specific user')
		.get('https://todo.ly/api/user.json')
		.expectStatus(200)
		
		.toss();


		frisby.create('Get list of filters from specific user')
		.get('https://todo.ly/api/filters.json')
		.expectStatus(200)
		
		.toss();
	})

.toss();