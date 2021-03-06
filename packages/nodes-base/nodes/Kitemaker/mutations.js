"use strict";
// ----------------------------------
//           mutations
// ----------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.editWorkItem = exports.createWorkItem = void 0;
exports.createWorkItem = `
	mutation($input: CreateWorkItemInput!) {
		createWorkItem(input: $input) {
			workItem {
				id
				number
				title
				description
				status {
					id
					name
				}
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
				effort
				impact
				updatedAt
				createdAt
			}
		}
	}
`;
exports.editWorkItem = `
	mutation ($input: EditWorkItemInput!) {
		editWorkItem(input: $input) {
			workItem {
				id
				number
				title
				description
				status {
					id
					name
				}
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
				effort
				impact
				updatedAt
				createdAt
			}
		}
	}
`;
