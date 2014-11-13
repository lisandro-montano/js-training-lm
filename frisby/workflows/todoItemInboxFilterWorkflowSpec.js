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

		frisby.create('Create a new item without project')
		.post('https://todo.ly/api/items.json', {
			Content: "My Test Item Inbox"
		})
		.expectStatus(200)
		.expectJSON({
			Content: "My Test Item Inbox"
		})

		.afterJSON(function(itemData){

			itemInboxId = itemData.Id;
			expect(itemData.DueDateTime).toBe(null);

			frisby.create('Obtain Id for Inbox Filter')
			.get('https://todo.ly/api/filters.json')
			.expectStatus(200)

			.afterJSON(function(filterList){
				
				for (var i = 0; i < filterList.length; i++) {
					if (filterList[i].Content == "Inbox") {
						inboxId = filterList[i].Id
					}
				}

				frisby.create('Verify Inbox filter includes the test item')
				.get('https://todo.ly/api/filters/' + inboxId + '/items.json')
				.expectStatus(200)
				.expectJSON('?', {
					Content: "My Test Item Inbox"
				})
				.afterJSON(function(data){

					frisby.create('Delete created item')
					.delete('https://todo.ly/api/items/' + itemInboxId + '.json')
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

