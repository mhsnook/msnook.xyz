export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export type Database = {
	mortality: {
		Tables: {
			baselines: {
				Row: {
					cause_id: number
					id: number
					is_default: boolean | null
					name: string
					notes: string | null
					rate: number
					reference_country_id: number | null
					reference_region_id: number | null
					year: number | null
				}
				Insert: {
					cause_id: number
					id?: number
					is_default?: boolean | null
					name: string
					notes?: string | null
					rate: number
					reference_country_id?: number | null
					reference_region_id?: number | null
					year?: number | null
				}
				Update: {
					cause_id?: number
					id?: number
					is_default?: boolean | null
					name?: string
					notes?: string | null
					rate?: number
					reference_country_id?: number | null
					reference_region_id?: number | null
					year?: number | null
				}
				Relationships: [
					{
						foreignKeyName: 'baselines_cause_id_fkey'
						columns: ['cause_id']
						isOneToOne: false
						referencedRelation: 'causes'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'baselines_cause_id_fkey'
						columns: ['cause_id']
						isOneToOne: false
						referencedRelation: 'excess_by_region'
						referencedColumns: ['cause_id']
					},
					{
						foreignKeyName: 'baselines_cause_id_fkey'
						columns: ['cause_id']
						isOneToOne: false
						referencedRelation: 'rate_matrix'
						referencedColumns: ['cause_id']
					},
					{
						foreignKeyName: 'baselines_cause_id_fkey'
						columns: ['cause_id']
						isOneToOne: false
						referencedRelation: 'rate_matrix'
						referencedColumns: ['cause_parent_id']
					},
					{
						foreignKeyName: 'baselines_reference_country_id_fkey'
						columns: ['reference_country_id']
						isOneToOne: false
						referencedRelation: 'countries'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'baselines_reference_country_id_fkey'
						columns: ['reference_country_id']
						isOneToOne: false
						referencedRelation: 'rate_matrix'
						referencedColumns: ['country_id']
					},
					{
						foreignKeyName: 'baselines_reference_region_id_fkey'
						columns: ['reference_region_id']
						isOneToOne: false
						referencedRelation: 'excess_by_region'
						referencedColumns: ['region_id']
					},
					{
						foreignKeyName: 'baselines_reference_region_id_fkey'
						columns: ['reference_region_id']
						isOneToOne: false
						referencedRelation: 'rate_matrix'
						referencedColumns: ['region_id']
					},
					{
						foreignKeyName: 'baselines_reference_region_id_fkey'
						columns: ['reference_region_id']
						isOneToOne: false
						referencedRelation: 'regions'
						referencedColumns: ['id']
					},
				]
			}
			causes: {
				Row: {
					description: string | null
					gbd_level: number
					id: number
					name: string
					parent_id: number | null
					slug: string
					sort_order: number
				}
				Insert: {
					description?: string | null
					gbd_level: number
					id: number
					name: string
					parent_id?: number | null
					slug: string
					sort_order?: number
				}
				Update: {
					description?: string | null
					gbd_level?: number
					id?: number
					name?: string
					parent_id?: number | null
					slug?: string
					sort_order?: number
				}
				Relationships: [
					{
						foreignKeyName: 'causes_parent_id_fkey'
						columns: ['parent_id']
						isOneToOne: false
						referencedRelation: 'causes'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'causes_parent_id_fkey'
						columns: ['parent_id']
						isOneToOne: false
						referencedRelation: 'excess_by_region'
						referencedColumns: ['cause_id']
					},
					{
						foreignKeyName: 'causes_parent_id_fkey'
						columns: ['parent_id']
						isOneToOne: false
						referencedRelation: 'rate_matrix'
						referencedColumns: ['cause_id']
					},
					{
						foreignKeyName: 'causes_parent_id_fkey'
						columns: ['parent_id']
						isOneToOne: false
						referencedRelation: 'rate_matrix'
						referencedColumns: ['cause_parent_id']
					},
				]
			}
			countries: {
				Row: {
					id: number
					iso3: string | null
					name: string
					population: number | null
					population_year: number | null
					region_id: number
				}
				Insert: {
					id: number
					iso3?: string | null
					name: string
					population?: number | null
					population_year?: number | null
					region_id: number
				}
				Update: {
					id?: number
					iso3?: string | null
					name?: string
					population?: number | null
					population_year?: number | null
					region_id?: number
				}
				Relationships: [
					{
						foreignKeyName: 'countries_region_id_fkey'
						columns: ['region_id']
						isOneToOne: false
						referencedRelation: 'excess_by_region'
						referencedColumns: ['region_id']
					},
					{
						foreignKeyName: 'countries_region_id_fkey'
						columns: ['region_id']
						isOneToOne: false
						referencedRelation: 'rate_matrix'
						referencedColumns: ['region_id']
					},
					{
						foreignKeyName: 'countries_region_id_fkey'
						columns: ['region_id']
						isOneToOne: false
						referencedRelation: 'regions'
						referencedColumns: ['id']
					},
				]
			}
			rates: {
				Row: {
					age_standardized_rate: number | null
					cause_id: number
					country_id: number | null
					crude_rate: number | null
					data_quality: string
					deaths_count: number | null
					id: number
					notes: string | null
					region_id: number | null
					source: string | null
					year: number
				}
				Insert: {
					age_standardized_rate?: number | null
					cause_id: number
					country_id?: number | null
					crude_rate?: number | null
					data_quality?: string
					deaths_count?: number | null
					id?: number
					notes?: string | null
					region_id?: number | null
					source?: string | null
					year: number
				}
				Update: {
					age_standardized_rate?: number | null
					cause_id?: number
					country_id?: number | null
					crude_rate?: number | null
					data_quality?: string
					deaths_count?: number | null
					id?: number
					notes?: string | null
					region_id?: number | null
					source?: string | null
					year?: number
				}
				Relationships: [
					{
						foreignKeyName: 'rates_cause_id_fkey'
						columns: ['cause_id']
						isOneToOne: false
						referencedRelation: 'causes'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'rates_cause_id_fkey'
						columns: ['cause_id']
						isOneToOne: false
						referencedRelation: 'excess_by_region'
						referencedColumns: ['cause_id']
					},
					{
						foreignKeyName: 'rates_cause_id_fkey'
						columns: ['cause_id']
						isOneToOne: false
						referencedRelation: 'rate_matrix'
						referencedColumns: ['cause_id']
					},
					{
						foreignKeyName: 'rates_cause_id_fkey'
						columns: ['cause_id']
						isOneToOne: false
						referencedRelation: 'rate_matrix'
						referencedColumns: ['cause_parent_id']
					},
					{
						foreignKeyName: 'rates_country_id_fkey'
						columns: ['country_id']
						isOneToOne: false
						referencedRelation: 'countries'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'rates_country_id_fkey'
						columns: ['country_id']
						isOneToOne: false
						referencedRelation: 'rate_matrix'
						referencedColumns: ['country_id']
					},
					{
						foreignKeyName: 'rates_region_id_fkey'
						columns: ['region_id']
						isOneToOne: false
						referencedRelation: 'excess_by_region'
						referencedColumns: ['region_id']
					},
					{
						foreignKeyName: 'rates_region_id_fkey'
						columns: ['region_id']
						isOneToOne: false
						referencedRelation: 'rate_matrix'
						referencedColumns: ['region_id']
					},
					{
						foreignKeyName: 'rates_region_id_fkey'
						columns: ['region_id']
						isOneToOne: false
						referencedRelation: 'regions'
						referencedColumns: ['id']
					},
				]
			}
			regions: {
				Row: {
					id: number
					name: string
					population: number | null
					population_year: number | null
					slug: string
					sort_order: number
					super_region_id: number
				}
				Insert: {
					id: number
					name: string
					population?: number | null
					population_year?: number | null
					slug: string
					sort_order?: number
					super_region_id: number
				}
				Update: {
					id?: number
					name?: string
					population?: number | null
					population_year?: number | null
					slug?: string
					sort_order?: number
					super_region_id?: number
				}
				Relationships: [
					{
						foreignKeyName: 'regions_super_region_id_fkey'
						columns: ['super_region_id']
						isOneToOne: false
						referencedRelation: 'excess_by_region'
						referencedColumns: ['super_region_id']
					},
					{
						foreignKeyName: 'regions_super_region_id_fkey'
						columns: ['super_region_id']
						isOneToOne: false
						referencedRelation: 'rate_matrix'
						referencedColumns: ['super_region_id']
					},
					{
						foreignKeyName: 'regions_super_region_id_fkey'
						columns: ['super_region_id']
						isOneToOne: false
						referencedRelation: 'super_regions'
						referencedColumns: ['id']
					},
				]
			}
			super_regions: {
				Row: {
					id: number
					name: string
					slug: string
					sort_order: number
				}
				Insert: {
					id: number
					name: string
					slug: string
					sort_order?: number
				}
				Update: {
					id?: number
					name?: string
					slug?: string
					sort_order?: number
				}
				Relationships: []
			}
		}
		Views: {
			excess_by_region: {
				Row: {
					actual_rate: number | null
					baseline_name: string | null
					baseline_rate: number | null
					cause_id: number | null
					cause_name: string | null
					cause_slug: string | null
					data_quality: string | null
					excess_deaths_est: number | null
					excess_pct: number | null
					excess_rate: number | null
					gbd_level: number | null
					population: number | null
					rate_id: number | null
					region_id: number | null
					region_name: string | null
					region_slug: string | null
					super_region_id: number | null
					super_region_name: string | null
					year: number | null
				}
				Relationships: []
			}
			rate_matrix: {
				Row: {
					age_standardized_rate: number | null
					cause_id: number | null
					cause_name: string | null
					cause_parent_id: number | null
					cause_parent_name: string | null
					cause_slug: string | null
					country_id: number | null
					country_name: string | null
					crude_rate: number | null
					data_quality: string | null
					deaths_count: number | null
					gbd_level: number | null
					id: number | null
					iso3: string | null
					notes: string | null
					population: number | null
					region_id: number | null
					region_name: string | null
					region_slug: string | null
					source: string | null
					super_region_id: number | null
					super_region_name: string | null
					super_region_slug: string | null
					year: number | null
				}
				Relationships: []
			}
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
	public: {
		Tables: {
			media: {
				Row: {
					alt_text: string | null
					bucket: string | null
					created_at: string | null
					file_modified_at: string | null
					file_size_kb: number | null
					filename: string
					height: number | null
					id: string
					updated_at: string | null
					url: string | null
					width: number | null
				}
				Insert: {
					alt_text?: string | null
					bucket?: string | null
					created_at?: string | null
					file_modified_at?: string | null
					file_size_kb?: number | null
					filename: string
					height?: number | null
					id?: string
					updated_at?: string | null
					url?: string | null
					width?: number | null
				}
				Update: {
					alt_text?: string | null
					bucket?: string | null
					created_at?: string | null
					file_modified_at?: string | null
					file_size_kb?: number | null
					filename?: string
					height?: number | null
					id?: string
					updated_at?: string | null
					url?: string | null
					width?: number | null
				}
				Relationships: []
			}
			media_meta: {
				Row: {
					center_box: Json | null
					created_at: string
					description: string | null
					id: string
					path: string
					tags: string[] | null
					updated_at: string | null
				}
				Insert: {
					center_box?: Json | null
					created_at?: string
					description?: string | null
					id?: string
					path: string
					tags?: string[] | null
					updated_at?: string | null
				}
				Update: {
					center_box?: Json | null
					created_at?: string
					description?: string | null
					id?: string
					path?: string
					tags?: string[] | null
					updated_at?: string | null
				}
				Relationships: []
			}
			posts: {
				Row: {
					author_id: string
					category: string | null
					content: string | null
					created_at: string | null
					excerpt: string | null
					id: string
					image: string | null
					published: boolean
					published_at: string | null
					slug: string
					title: string | null
					updated_at: string | null
				}
				Insert: {
					author_id?: string
					category?: string | null
					content?: string | null
					created_at?: string | null
					excerpt?: string | null
					id?: string
					image?: string | null
					published?: boolean
					published_at?: string | null
					slug?: string
					title?: string | null
					updated_at?: string | null
				}
				Update: {
					author_id?: string
					category?: string | null
					content?: string | null
					created_at?: string | null
					excerpt?: string | null
					id?: string
					image?: string | null
					published?: boolean
					published_at?: string | null
					slug?: string
					title?: string | null
					updated_at?: string | null
				}
				Relationships: []
			}
			projects: {
				Row: {
					created_at: string
					description: string | null
					github: string | null
					id: string
					image: string | null
					published: boolean
					sort_order: number
					tags: string[] | null
					title: string
					updated_at: string | null
					url: string | null
				}
				Insert: {
					created_at?: string
					description?: string | null
					github?: string | null
					id?: string
					image?: string | null
					published?: boolean
					sort_order?: number
					tags?: string[] | null
					title: string
					updated_at?: string | null
					url?: string | null
				}
				Update: {
					created_at?: string
					description?: string | null
					github?: string | null
					id?: string
					image?: string | null
					published?: boolean
					sort_order?: number
					tags?: string[] | null
					title?: string
					updated_at?: string | null
					url?: string | null
				}
				Relationships: []
			}
			todo_inbox: {
				Row: {
					created_at: string
					id: string
					raw_text: string
					source: string
					user_id: string
				}
				Insert: {
					created_at?: string
					id?: string
					raw_text: string
					source?: string
					user_id?: string
				}
				Update: {
					created_at?: string
					id?: string
					raw_text?: string
					source?: string
					user_id?: string
				}
				Relationships: []
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
	storage: {
		Tables: {
			buckets: {
				Row: {
					allowed_mime_types: string[] | null
					avif_autodetection: boolean | null
					created_at: string | null
					file_size_limit: number | null
					id: string
					name: string
					owner: string | null
					owner_id: string | null
					public: boolean | null
					type: Database['storage']['Enums']['buckettype']
					updated_at: string | null
				}
				Insert: {
					allowed_mime_types?: string[] | null
					avif_autodetection?: boolean | null
					created_at?: string | null
					file_size_limit?: number | null
					id: string
					name: string
					owner?: string | null
					owner_id?: string | null
					public?: boolean | null
					type?: Database['storage']['Enums']['buckettype']
					updated_at?: string | null
				}
				Update: {
					allowed_mime_types?: string[] | null
					avif_autodetection?: boolean | null
					created_at?: string | null
					file_size_limit?: number | null
					id?: string
					name?: string
					owner?: string | null
					owner_id?: string | null
					public?: boolean | null
					type?: Database['storage']['Enums']['buckettype']
					updated_at?: string | null
				}
				Relationships: []
			}
			buckets_analytics: {
				Row: {
					created_at: string
					deleted_at: string | null
					format: string
					id: string
					name: string
					type: Database['storage']['Enums']['buckettype']
					updated_at: string
				}
				Insert: {
					created_at?: string
					deleted_at?: string | null
					format?: string
					id?: string
					name: string
					type?: Database['storage']['Enums']['buckettype']
					updated_at?: string
				}
				Update: {
					created_at?: string
					deleted_at?: string | null
					format?: string
					id?: string
					name?: string
					type?: Database['storage']['Enums']['buckettype']
					updated_at?: string
				}
				Relationships: []
			}
			buckets_vectors: {
				Row: {
					created_at: string
					id: string
					type: Database['storage']['Enums']['buckettype']
					updated_at: string
				}
				Insert: {
					created_at?: string
					id: string
					type?: Database['storage']['Enums']['buckettype']
					updated_at?: string
				}
				Update: {
					created_at?: string
					id?: string
					type?: Database['storage']['Enums']['buckettype']
					updated_at?: string
				}
				Relationships: []
			}
			iceberg_namespaces: {
				Row: {
					bucket_name: string
					catalog_id: string
					created_at: string
					id: string
					metadata: Json
					name: string
					updated_at: string
				}
				Insert: {
					bucket_name: string
					catalog_id: string
					created_at?: string
					id?: string
					metadata?: Json
					name: string
					updated_at?: string
				}
				Update: {
					bucket_name?: string
					catalog_id?: string
					created_at?: string
					id?: string
					metadata?: Json
					name?: string
					updated_at?: string
				}
				Relationships: [
					{
						foreignKeyName: 'iceberg_namespaces_catalog_id_fkey'
						columns: ['catalog_id']
						isOneToOne: false
						referencedRelation: 'buckets_analytics'
						referencedColumns: ['id']
					},
				]
			}
			iceberg_tables: {
				Row: {
					bucket_name: string
					catalog_id: string
					created_at: string
					id: string
					location: string
					name: string
					namespace_id: string
					remote_table_id: string | null
					shard_id: string | null
					shard_key: string | null
					updated_at: string
				}
				Insert: {
					bucket_name: string
					catalog_id: string
					created_at?: string
					id?: string
					location: string
					name: string
					namespace_id: string
					remote_table_id?: string | null
					shard_id?: string | null
					shard_key?: string | null
					updated_at?: string
				}
				Update: {
					bucket_name?: string
					catalog_id?: string
					created_at?: string
					id?: string
					location?: string
					name?: string
					namespace_id?: string
					remote_table_id?: string | null
					shard_id?: string | null
					shard_key?: string | null
					updated_at?: string
				}
				Relationships: [
					{
						foreignKeyName: 'iceberg_tables_catalog_id_fkey'
						columns: ['catalog_id']
						isOneToOne: false
						referencedRelation: 'buckets_analytics'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'iceberg_tables_namespace_id_fkey'
						columns: ['namespace_id']
						isOneToOne: false
						referencedRelation: 'iceberg_namespaces'
						referencedColumns: ['id']
					},
				]
			}
			migrations: {
				Row: {
					executed_at: string | null
					hash: string
					id: number
					name: string
				}
				Insert: {
					executed_at?: string | null
					hash: string
					id: number
					name: string
				}
				Update: {
					executed_at?: string | null
					hash?: string
					id?: number
					name?: string
				}
				Relationships: []
			}
			objects: {
				Row: {
					bucket_id: string | null
					created_at: string | null
					id: string
					last_accessed_at: string | null
					level: number | null
					metadata: Json | null
					name: string | null
					owner: string | null
					owner_id: string | null
					path_tokens: string[] | null
					updated_at: string | null
					user_metadata: Json | null
					version: string | null
				}
				Insert: {
					bucket_id?: string | null
					created_at?: string | null
					id?: string
					last_accessed_at?: string | null
					level?: number | null
					metadata?: Json | null
					name?: string | null
					owner?: string | null
					owner_id?: string | null
					path_tokens?: string[] | null
					updated_at?: string | null
					user_metadata?: Json | null
					version?: string | null
				}
				Update: {
					bucket_id?: string | null
					created_at?: string | null
					id?: string
					last_accessed_at?: string | null
					level?: number | null
					metadata?: Json | null
					name?: string | null
					owner?: string | null
					owner_id?: string | null
					path_tokens?: string[] | null
					updated_at?: string | null
					user_metadata?: Json | null
					version?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'objects_bucketId_fkey'
						columns: ['bucket_id']
						isOneToOne: false
						referencedRelation: 'buckets'
						referencedColumns: ['id']
					},
				]
			}
			prefixes: {
				Row: {
					bucket_id: string
					created_at: string | null
					level: number
					name: string
					updated_at: string | null
				}
				Insert: {
					bucket_id: string
					created_at?: string | null
					level?: number
					name: string
					updated_at?: string | null
				}
				Update: {
					bucket_id?: string
					created_at?: string | null
					level?: number
					name?: string
					updated_at?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'prefixes_bucketId_fkey'
						columns: ['bucket_id']
						isOneToOne: false
						referencedRelation: 'buckets'
						referencedColumns: ['id']
					},
				]
			}
			s3_multipart_uploads: {
				Row: {
					bucket_id: string
					created_at: string
					id: string
					in_progress_size: number
					key: string
					owner_id: string | null
					upload_signature: string
					user_metadata: Json | null
					version: string
				}
				Insert: {
					bucket_id: string
					created_at?: string
					id: string
					in_progress_size?: number
					key: string
					owner_id?: string | null
					upload_signature: string
					user_metadata?: Json | null
					version: string
				}
				Update: {
					bucket_id?: string
					created_at?: string
					id?: string
					in_progress_size?: number
					key?: string
					owner_id?: string | null
					upload_signature?: string
					user_metadata?: Json | null
					version?: string
				}
				Relationships: [
					{
						foreignKeyName: 's3_multipart_uploads_bucket_id_fkey'
						columns: ['bucket_id']
						isOneToOne: false
						referencedRelation: 'buckets'
						referencedColumns: ['id']
					},
				]
			}
			s3_multipart_uploads_parts: {
				Row: {
					bucket_id: string
					created_at: string
					etag: string
					id: string
					key: string
					owner_id: string | null
					part_number: number
					size: number
					upload_id: string
					version: string
				}
				Insert: {
					bucket_id: string
					created_at?: string
					etag: string
					id?: string
					key: string
					owner_id?: string | null
					part_number: number
					size?: number
					upload_id: string
					version: string
				}
				Update: {
					bucket_id?: string
					created_at?: string
					etag?: string
					id?: string
					key?: string
					owner_id?: string | null
					part_number?: number
					size?: number
					upload_id?: string
					version?: string
				}
				Relationships: [
					{
						foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey'
						columns: ['bucket_id']
						isOneToOne: false
						referencedRelation: 'buckets'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey'
						columns: ['upload_id']
						isOneToOne: false
						referencedRelation: 's3_multipart_uploads'
						referencedColumns: ['id']
					},
				]
			}
			vector_indexes: {
				Row: {
					bucket_id: string
					created_at: string
					data_type: string
					dimension: number
					distance_metric: string
					id: string
					metadata_configuration: Json | null
					name: string
					updated_at: string
				}
				Insert: {
					bucket_id: string
					created_at?: string
					data_type: string
					dimension: number
					distance_metric: string
					id?: string
					metadata_configuration?: Json | null
					name: string
					updated_at?: string
				}
				Update: {
					bucket_id?: string
					created_at?: string
					data_type?: string
					dimension?: number
					distance_metric?: string
					id?: string
					metadata_configuration?: Json | null
					name?: string
					updated_at?: string
				}
				Relationships: [
					{
						foreignKeyName: 'vector_indexes_bucket_id_fkey'
						columns: ['bucket_id']
						isOneToOne: false
						referencedRelation: 'buckets_vectors'
						referencedColumns: ['id']
					},
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			add_prefixes: {
				Args: { _bucket_id: string; _name: string }
				Returns: undefined
			}
			can_insert_object: {
				Args: { bucketid: string; metadata: Json; name: string; owner: string }
				Returns: undefined
			}
			delete_leaf_prefixes: {
				Args: { bucket_ids: string[]; names: string[] }
				Returns: undefined
			}
			delete_prefix: {
				Args: { _bucket_id: string; _name: string }
				Returns: boolean
			}
			extension: {
				Args: { name: string }
				Returns: string
			}
			filename: {
				Args: { name: string }
				Returns: string
			}
			foldername: {
				Args: { name: string }
				Returns: string[]
			}
			get_level: {
				Args: { name: string }
				Returns: number
			}
			get_prefix: {
				Args: { name: string }
				Returns: string
			}
			get_prefixes: {
				Args: { name: string }
				Returns: string[]
			}
			get_size_by_bucket: {
				Args: Record<PropertyKey, never>
				Returns: {
					bucket_id: string
					size: number
				}[]
			}
			list_multipart_uploads_with_delimiter: {
				Args: {
					bucket_id: string
					delimiter_param: string
					max_keys?: number
					next_key_token?: string
					next_upload_token?: string
					prefix_param: string
				}
				Returns: {
					created_at: string
					id: string
					key: string
				}[]
			}
			list_objects_with_delimiter: {
				Args: {
					bucket_id: string
					delimiter_param: string
					max_keys?: number
					next_token?: string
					prefix_param: string
					start_after?: string
				}
				Returns: {
					id: string
					metadata: Json
					name: string
					updated_at: string
				}[]
			}
			lock_top_prefixes: {
				Args: { bucket_ids: string[]; names: string[] }
				Returns: undefined
			}
			operation: {
				Args: Record<PropertyKey, never>
				Returns: string
			}
			search: {
				Args:
					| {
							bucketname: string
							levels?: number
							limits?: number
							offsets?: number
							prefix: string
					  }
					| {
							bucketname: string
							levels?: number
							limits?: number
							offsets?: number
							prefix: string
							search?: string
							sortcolumn?: string
							sortorder?: string
					  }
				Returns: {
					created_at: string
					id: string
					last_accessed_at: string
					metadata: Json
					name: string
					updated_at: string
				}[]
			}
			search_legacy_v1: {
				Args: {
					bucketname: string
					levels?: number
					limits?: number
					offsets?: number
					prefix: string
					search?: string
					sortcolumn?: string
					sortorder?: string
				}
				Returns: {
					created_at: string
					id: string
					last_accessed_at: string
					metadata: Json
					name: string
					updated_at: string
				}[]
			}
			search_v1_optimised: {
				Args: {
					bucketname: string
					levels?: number
					limits?: number
					offsets?: number
					prefix: string
					search?: string
					sortcolumn?: string
					sortorder?: string
				}
				Returns: {
					created_at: string
					id: string
					last_accessed_at: string
					metadata: Json
					name: string
					updated_at: string
				}[]
			}
			search_v2: {
				Args:
					| {
							bucket_name: string
							levels?: number
							limits?: number
							prefix: string
							sort_column?: string
							sort_column_after?: string
							sort_order?: string
							start_after?: string
					  }
					| {
							bucket_name: string
							levels?: number
							limits?: number
							prefix: string
							start_after?: string
					  }
				Returns: {
					created_at: string
					id: string
					key: string
					metadata: Json
					name: string
					updated_at: string
				}[]
			}
		}
		Enums: {
			buckettype: 'STANDARD' | 'ANALYTICS' | 'VECTOR'
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
				DefaultSchema['Views'])
		? (DefaultSchema['Tables'] &
				DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema['Enums']
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never

export const Constants = {
	mortality: {
		Enums: {},
	},
	public: {
		Enums: {},
	},
	storage: {
		Enums: {
			buckettype: ['STANDARD', 'ANALYTICS', 'VECTOR'],
		},
	},
} as const
