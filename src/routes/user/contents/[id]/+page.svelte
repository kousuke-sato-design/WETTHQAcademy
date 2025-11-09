<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function getSectionTypeColor(sectionType: string) {
		const colors: Record<string, string> = {
			introduction: 'border-blue-500',
			text: 'border-gray-500',
			video: 'border-purple-500',
			image: 'border-pink-500',
			attachment: 'border-green-500'
		};
		return colors[sectionType] || 'border-gray-500';
	}

	// 動画URLを埋め込み形式に変換
	function convertToEmbedUrl(url: string): string {
		if (!url) return '';

		// YouTube URL変換
		// https://www.youtube.com/watch?v=VIDEO_ID → https://www.youtube.com/embed/VIDEO_ID
		// https://youtu.be/VIDEO_ID → https://www.youtube.com/embed/VIDEO_ID
		const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
		if (youtubeMatch) {
			return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
		}

		// Vimeo URL変換
		// https://vimeo.com/VIDEO_ID → https://player.vimeo.com/video/VIDEO_ID
		const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
		if (vimeoMatch) {
			return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
		}

		// すでに埋め込み形式の場合、またはその他のURLはそのまま返す
		return url;
	}
</script>

<svelte:head>
	<title>{data.content.title} - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user} contents={data.contents}>
	<div class="max-w-4xl mx-auto">
		<!-- コンテンツヘッダー -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
			<h1 class="text-4xl font-bold text-gray-900 mb-4">{data.content.title}</h1>

			{#if data.content.category}
				<div class="mb-4">
					<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
						{data.content.category}
					</span>
				</div>
			{/if}

			{#if data.content.description}
				<p class="text-gray-600 text-lg leading-relaxed">{data.content.description}</p>
			{/if}
		</div>

		<!-- セクションコンテンツ -->
		{#if data.sections.length === 0}
			<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
				<p class="text-yellow-800">このコンテンツにはまだセクションが追加されていません。</p>
			</div>
		{:else}
			<!-- 1つの大きなボックスにすべてのセクションをまとめる -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
				<div class="space-y-12">
					{#each data.sections as section}
						<div class="space-y-6">
							{#if section.title}
								<h2 class="text-2xl font-bold text-gray-900 pb-3 border-b border-gray-200">{section.title}</h2>
							{/if}

							<div class="space-y-6">
								{#each section.items as item}
									{#if item.type === 'heading'}
										<h3 class="text-xl font-semibold text-gray-800 mt-6">{item.content}</h3>
									{:else if item.type === 'text'}
										<p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.content}</p>
									{:else if item.type === 'video' && item.content}
										<div class="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-md">
											<iframe
												src={convertToEmbedUrl(item.content)}
												class="w-full h-full"
												frameborder="0"
												allowfullscreen
												title="Video content"
											></iframe>
										</div>
									{:else if item.type === 'image' && item.content}
										<img
											src={item.content}
											alt=""
											class="w-full rounded-lg shadow-md"
										/>
									{/if}
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</Layout>
