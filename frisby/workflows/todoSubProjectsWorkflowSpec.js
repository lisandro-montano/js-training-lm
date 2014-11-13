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
	
		frisby.create('Create a new project and verify it has no children')
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
			expect(projectData.Children.length).toEqual(0);

			frisby.create('Verify the project is listed in all projects')
			.get('https://todo.ly/api/projects.json')
			.expectStatus(200)
			.expectJSONTypes('?', { 
				Id: projectId 
			})
			.toss()

			frisby.create('Create a sub project in the one we just created')
			.post('https://todo.ly/api/projects.json', {
				Content: "Test Sub Project",
				Icon: 5,
				ParentId: projectId
			})
			.expectStatus(200)
			.expectJSON({
				Content: "Test Sub Project",
				Icon: 5,
				ParentId: projectId
			})
			.toss()

			frisby.create('Verify parent project has Child objects')
			.get('https://todo.ly/api/projects/' + projectId + '.json')
			.expectStatus(200)
			.afterJSON(function(parentProject){
				expect(parentProject.Children.length).toBeGreaterThan(0);
			})
		
			frisby.create('Delete created parent project')
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