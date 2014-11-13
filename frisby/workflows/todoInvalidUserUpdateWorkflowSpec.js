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

		frisby.create('Verify Invalid Email message when trying to create an account')
			.post('https://todo.ly/api/user/0.json', {
			    "Email": "wrongemail.com"
			  })
			.expectStatus(200)
			.expectJSON({ 
				ErrorMessage: 'Invalid input Data',
		  		ErrorCode: 302
		  	})

		.toss()

		frisby.create('Obtain Full name and Password fields')
			.get('https://todo.ly/api/user.json')
			.expectStatus(200)

			.afterJSON(function(currentUser){

				fullName = currentUser.FullName;
				pwd = currentUser.Password;

				frisby.create('Verify Full Name does not change when updating with invalid info')
					.post('https://todo.ly/api/user/0.json', {
					    "FullName": ""
					})
					.expectStatus(200)

					.afterJSON(function(output){
						expect(output.FullName).toBe(fullName)
					})

				.toss()

				frisby.create('Verify password is not modified through Update User from API')
					.post('https://todo.ly/api/user/0.json', {
					    "Password": ""
					})
					.expectStatus(200)

					.afterJSON(function(output){
						expect(output.Password).toBe(pwd)
					})
					
				.toss()

			})

		.toss()			

	})
.toss()