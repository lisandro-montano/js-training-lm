var frisby = require('frisby');

var newProject = {
	Content: "Test Project",
	Icon: 4
}

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
	
		frisby.create('Create a new project')
		.post('https://todo.ly/api/projects.json', newProject)
		.expectStatus(200)
		.expectJSONTypes({ 
			Id: Number,
		    Content: String,
		    ItemsCount: Number,
		    Icon: Number
		})

		.afterJSON(function(projectData){

			projectId = projectData.Id;

			frisby.create('Verify the project is listed in all projects')
			.get('https://todo.ly/api/projects.json')
			.expectStatus(200)
			.expectJSONTypes('?', { 
				Id: projectId 
			})
			.toss()

			frisby.create('Update created project and verify changes are properly reflected')
			.put('https://todo.ly/api/projects/' + projectId + '.json', {
				Content : "My Updated Test Project",
				Icon: 5
			})
			.expectStatus(200)
			.expectJSON({
				Content : "My Updated Test Project",
				Icon: 5
			})
			.toss()
		
			frisby.create('Delete created project')
			.delete('https://todo.ly/api/projects/' + projectId + '.json')
			.expectStatus(200)
			.expectJSON({ 
				Deleted: true 
			})
			.toss()

		})
		.toss()

	})
.toss()