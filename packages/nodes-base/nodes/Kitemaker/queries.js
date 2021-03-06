"use strict";
// ----------------------------------
//             queries
// ----------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllWorkItems = exports.getWorkItem = exports.getWorkItems = exports.getUsers = exports.getStatuses = exports.getSpaces = exports.getOrganization = exports.getLabels = exports.getAllUsers = exports.getAllSpaces = void 0;
exports.getAllSpaces = `
	query {
		organization {
			spaces {
				id
				name
				labels {
					id
					name
					color
				}
				statuses {
					id
					name
					type
					default
				}
			}
		}
	}
`;
exports.getAllUsers = `
	query {
		organization {
			users {
				id
				username
			}
		}
	}
`;
exports.getLabels = `
	query {
		organization {
			spaces {
				labels {
					id
					name
					color
				}
			}
		}
	}
`;
exports.getOrganization = `
	query {
		organization {
			id
			name
		}
	}
`;
exports.getSpaces = `
	query {
		organization {
			spaces {
				id
				name
				labels {
					id
					name
					color
				}
				statuses {
					id
					name
					type
					default
				}
			}
		}
	}
`;
exports.getStatuses = `
	query {
		organization {
			spaces {
				id
				statuses {
					id
					name
					type
					default
				}
			}
		}
	}
`;
exports.getUsers = `
	query {
		organization {
			users {
				id
				username
			}
		}
	}
`;
exports.getWorkItems = `
	query($spaceId: ID!) {
		workItems(spaceId: $spaceId) {
			workItems {
				id
				title
			}
		}
	}
`;
exports.getWorkItem = `
	query($workItemId: ID!) {
		workItem(id: $workItemId) {
			id
			number
			title
			description
			status {
				id
				name
			}
			sort
			members {
				id
				username
			}
			watchers {
				id
				username
			}
			labels {
				id
				name
			}
			comments {
				id
				actor {
					__typename
				}
				body
				threadId
				updatedAt
				createdAt
			}
			effort
			impact
			updatedAt
			createdAt
		}
	}
`;
exports.getAllWorkItems = `
	query($spaceId: ID!, $cursor: String) {
		workItems(spaceId: $spaceId, cursor: $cursor) {
			hasMore,
			cursor,
			workItems {
				id
				title
				description
				labels {
					id
				}
				comments {
					id
					body
					actor {
						... on User {
							id
							username
						}
						... on IntegrationUser {
							id
							externalName
						}
						... on Integration {
							id
							type
						}
						... on Application {
							id
							name
						}
					}
				}
			}
		}
	}
`;
