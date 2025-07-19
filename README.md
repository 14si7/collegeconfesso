GraphQL API Operations Documentation
Welcome to the GraphQL API documentation for our services. This guide outlines the available operations, grouped by service, including authentication requirements, headers, and detailed descriptions.
🔐 Authentication Details
To interact with protected endpoints, include the following header with a valid JWT token obtained from the register or login mutations:
{
  "Authorization": "bearer YOUR_JWT_TOKEN"
}

Replace YOUR_JWT_TOKEN with the token returned from the login/register mutation.

✅ User Service
1. Register User
mutation {
  register(username: "testuser", secretCode: "password123") {
    token
    user {
      id
      username
    }
  }
}


🔐 Authentication Required: ❌ No
🧾 Header: None
📘 Description: Creates a new user account and returns a JWT token for authentication.

2. Login User
mutation {
  login(username: "testuser", secretCode: "password123") {
    token
    user {
      id
      username
    }
  }
}


🔐 Authentication Required: ❌ No
🧾 Header: None
📘 Description: Authenticates an existing user and returns a JWT token.


🗣️ Confession Service
3. Create Confession
mutation {
  createConfession(content: "My second confession") {
    id
    content
    user { username }
    createdAt
  }
}


🔐 Authentication Required: ✅ Yes
🧾 Header:{ "Authorization": "bearer YOUR_JWT_TOKEN" }


📘 Description: Creates a new confession associated with the authenticated user.

4. Get All Confessions
query {
  confessions {
    id
    content
    user { username }
    createdAt
  }
}


🔐 Authentication Required: ❌ No
🧾 Header: None
📘 Description: Retrieves all confessions, publicly accessible.

5. Update Confession
mutation {
  updateConfession(id: "CONFESSION_ID", content: "Updated confession") {
    id
    content
  }
}


🔐 Authentication Required: ✅ Yes
🧾 Header:{ "Authorization": "bearer YOUR_JWT_TOKEN" }


📘 Description: Updates a confession created by the authenticated user.

6. Delete Confession
mutation {
  deleteConfession(id: "CONFESSION_ID") {
    id
    content
  }
}


🔐 Authentication Required: ✅ Yes
🧾 Header:{ "Authorization": "bearer YOUR_JWT_TOKEN" }


📘 Description: Deletes a confession created by the authenticated user. Validates token ownership.


💬 Comment Service
7. Create Comment
mutation {
  createComment(
    confessionId: "CONFESSION_ID",
    content: "This is a new comment!"
  ) {
    id
    content
    createdAt
    user {
      id
      username
    }
  }
}


🔐 Authentication Required: ✅ Yes
🧾 Header:{ "Authorization": "bearer YOUR_JWT_TOKEN" }


📘 Description: Adds a comment to a specific confession by the authenticated user.

8. Get Comments for a Confession
query {
  comments(confessionId: "CONFESSION_ID") {
    id
    content
    createdAt
    user {
      id
      username
    }
  }
}


🔐 Authentication Required: ❌ No
🧾 Header: None
📘 Description: Retrieves all comments for a specific confession, publicly accessible.


🧠 Summary Table



Operation
Auth Required
Header Needed
Notes



Register
❌ No
None
Returns JWT on successful register


Login
❌ No
None
Returns JWT on successful login


Create Confession
✅ Yes
Authorization
User must be logged in


View Confessions
❌ No
None
Public access


Update Confession
✅ Yes
Authorization
Only user who created it can update


Delete Confession
✅ Yes
Authorization
Only user who created it can delete


Create Comment
✅ Yes
Authorization
Only logged-in users can comment


View Comments
❌ No
None
Publicly available



📝 Notes

Ensure all requests to protected endpoints include a valid Authorization header.
Public endpoints (View Confessions, View Comments) do not require authentication and are accessible to all users.
For mutations requiring authentication, the server validates that the user performing the action owns the resource (e.g., updating or deleting a confession).

This documentation is designed to be clear and concise for developers integrating with the GraphQL API. For further details or support, please refer to the official API documentation or contact our support team