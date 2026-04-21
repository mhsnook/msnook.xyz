import { useMutation } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-client'
import { filenameFromFile } from '@/lib/utils'

export function useUploadImage() {
	return useMutation({
		mutationFn: async (file: File) => {
			const filename = filenameFromFile(file)
			const { data, error } = await createClient()
				.storage.from('images')
				.upload(filename, file, { cacheControl: '31536000, immutable', upsert: true })
			if (error) throw error
			return data
		},
	})
}
