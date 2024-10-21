const schema = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    verified: Boolean!
    token: String
  }

  type Note {
    id: ID!
    title: String!
    content: String!
    isArchived: Boolean!
    userId: ID!
    createdAt: String!
    updatedAt: String
    user: User!
  }

  type Tag {
    id: ID!
    name: String!
  }

  type NoteTag {
    noteId: ID!
    tagId: ID!
  }

  input AuthInput {
    username: String!
    email: String!
    password: String!
  }

  input CreateNoteInput {
    title: String!
    content: String!
  }

  input CreateTagInput {
    name: String!
  }

  input CreateNoteTagInput {
    noteId: ID!
    tagId: ID!
  }

  input EditNoteInput {
    id: ID!
    title: String
    content: String
    isArchived: Boolean
  }

  type Query {
    users: [User]!
    user(id: ID!): User
    notes: [Note]!
    note(id: ID!): Note
    tags: [Tag]!
    tag(id: ID!): Tag
  }

  type Mutation {
    signin(input: AuthInput!): User
    signup(input: AuthInput!): User
    createNote(input: CreateNoteInput!): Note
    createTag(input: CreateTagInput!): Tag
    createNoteTag(input: CreateNoteTagInput!): NoteTag
    editNote(input: EditNoteInput!): Note!
    deleteNote(id: ID!): Note
    }

`;

export default schema;
