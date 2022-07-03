"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseApi = void 0;
class SupabaseApi {
    constructor() {
        this.name = 'supabaseApi';
        this.displayName = 'Supabase API';
        this.documentationUrl = 'supabase';
        this.properties = [
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                placeholder: 'https://your_account.supabase.co',
                default: '',
            },
            {
                displayName: 'Service Role Secret',
                name: 'serviceRole',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.SupabaseApi = SupabaseApi;
