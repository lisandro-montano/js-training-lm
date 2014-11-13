var frisby = require('frisby');

frisby.create('Obtain token for sanity tests')
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

		frisby.create('Get all projects from specific account and verify main data types')
		.get('https://todo.ly/api/projects.json')
		.expectStatus(200)
		.expectJSONTypes('*', { 
			Id: Number,
		    Content: String,
		    ItemsCount: Number,
		    Icon: Number 
		})

		.afterJSON(function(projectData){

			projectId = projectData[0].Id

			frisby.create('Get project by id and verify main data types')
			.get('https://todo.ly/api/projects/' + projectId + '.json')
			.expectStatus(200)
			.expectJSON({ 
				Id: projectId 
			})

			.toss();

		})
		
		.toss();

		frisby.create('Get all items from specific account and verify main data types')
		.get('https://todo.ly/api/items.json')
		.expectStatus(200)
		.expectJSONTypes('*', { 
			Id: Number,
		    Content: String,
		    Checked: Boolean,
		    ProjectId: Number,
		    OwnerId: Number 
		})
		
		.toss();

		frisby.create('Get information from specific user and verify main data types')
		.get('https://todo.ly/api/user.json')
		.expectStatus(200)
		.expectJSONTypes({ 
			Id: Number,
			Email: String,
			FullName: String
		})
		
		.toss();


		frisby.create('Get list of filters from specific user and verify main data types')
		.get('https://todo.ly/api/filters.json')
		.expectStatus(200)
		.expectJSONTypes('*', { 
			Id: Number,
		    Content: String,
		    ItemsCount: Number,
		    Icon: Number,
		    ItemType: Number
		})
		
		.toss();
	})

.toss();