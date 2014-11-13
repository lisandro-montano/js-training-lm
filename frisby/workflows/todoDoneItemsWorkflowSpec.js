var frisby = require('frisby');

var newProject = {
	Content: "Test Project Done Items",
	Icon: 6
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

		.afterJSON(function(projectData){

			projectId = projectData.Id;
			expect(projectData.Children.length).toEqual(0);

			frisby.create('Create a sub project in the project we just created')
			.post('https://todo.ly/api/projects.json', {
				Content: "Test Sub Project Done Items",
				Icon: 6,
				ParentId: projectId
			})
			.expectStatus(200)
			.expectJSON({
				Content: "Test Sub Project Done Items",
				Icon: 6,
				ParentId: projectId
			})

			.afterJSON(function(subProjectData){

				subProjectId = subProjectData.Id
				parentProjectId = subProjectData.ParentId

				frisby.create('Create a new done item in the subproject')
				.post('https://todo.ly/api/items.json', {
					Content: "My Test Done Item 1",
					Checked: true,
					ProjectId: subProjectId
				})
				.expectStatus(200)
				.expectJSON({
					Content: "My Test Done Item 1",
					Checked: true,
					ProjectId: subProjectId
				})

				.toss()

				frisby.create('Create a new done item in the subproject')
				.post('https://todo.ly/api/items.json', {
					Content: "My Test Done Item 2",
					Checked: true,
					ProjectId: subProjectId
				})
				.expectStatus(200)
				.expectJSON({
					Content: "My Test Done Item 2",
					Checked: true,
					ProjectId: subProjectId
				})

				.toss()

				frisby.create('Create a new item in the subproject')
				.post('https://todo.ly/api/items.json', {
					Content: "My Test Item 1",
					ProjectId: subProjectId
				})
				.expectStatus(200)
				.expectJSON({
					Content: "My Test Item 1",
					ProjectId: subProjectId
				})

				.toss()

				frisby.create('Verify only one item exists in the subproject')
				.get('https://todo.ly/api/projects/' + subProjectId + '/items.json')
				.expectStatus(200)
				.afterJSON(function(itemsData){
					expect (itemsData.length).toBe(1)
				})
				.toss()

				frisby.create('Verify two done items exist in the subproject')
				.get('https://todo.ly/api/projects/' + subProjectId + '/doneitems.json')
				.expectStatus(200)
				.afterJSON(function(doneItemsData){
					expect (doneItemsData.length).toBe(2)
				})
				.toss()

				frisby.create('Delete created parent project')
				.delete('https://todo.ly/api/projects/' + parentProjectId + '.json')
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