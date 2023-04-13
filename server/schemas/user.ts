export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {name: 'username', title: 'Username', type: 'string'},
    {name: 'family_name', title: 'FamilyName', type: 'string'},
    {name: 'given_name', title: 'GivenName', type: 'string'},
    {name: 'picture', title: 'Picture', type: 'string'},
    {name: 'email', title: 'Email', type: 'string'},
  ],
}