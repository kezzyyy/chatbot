<script lang="ts">
  import MarkdownIt from 'markdown-it';
  import { writable } from 'svelte/store';

  let userQuery = '';
  let isLoading = writable(false);
  let error = writable('');
  let chatHistory = writable<{ sender: 'user' | 'ai'; message: string }[]>([]);
  const md = MarkdownIt();

  async function sendQuery() {
    if (!userQuery.trim()) return;

    chatHistory.update(history => [...history, { sender: 'user', message: userQuery }]);
    isLoading.set(true);
    error.set('');

    try {
      const request = await fetch('http://localhost:5173/api2/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: userQuery,
          system_instruction: "Answer only what is asked. Keep responses concise and do not add extra details or assumptions." 
        })
      });

      if (!request.ok) throw new Error('Failed to fetch AI response');

      const apiResponse = await request.json();
      let aiResponse = apiResponse?.message || 'No response from AI.';

      // Fixed regex issue
      aiResponse = aiResponse.replace(/<think>([\s\S]*?)<\/think>/g, '').trim();
      aiResponse = aiResponse.split('.')[0] + '.';

      chatHistory.update(history => [...history, { sender: 'ai', message: aiResponse }]);
    } catch (err) {
      console.error('Error sending query:', err);
      error.set('Oops! Something went wrong.');
    } finally {
      userQuery = '';
      isLoading.set(false);
    }
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-6" 
     style="background-image: url('https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDJndjE0bjRuZTY5eHdjczB5ajk2N3ZpMTVua3M5NHE5NThvYjhoMiZlcD12MV9pbnRlcm5naWZfYnlfaWQmY3Q9Zw/xT0GqcCJJJH12hJvGM/giphy.gif'); 
     background-size: cover; background-position: center; background-repeat: no-repeat;">
  
  <div class="max-w-3xl w-full bg-white/80 rounded-xl shadow-xl p-8 border border-blue-300 backdrop-blur-lg flex flex-col-reverse md:flex-row items-center">
    
    <div class="md:w-1/2 w-full text-center md:text-left p-4">
      <h2 class="text-4xl font-bold text-blue-500 mb-4 uppercase tracking-wide">
        Chat Assistant
      </h2>
      <p class="text-blue-400 text-md mb-6 italic">With my information</p>
    </div>

    <div class="md:w-1/2 w-full space-y-4 p-4">
      <input 
        type="text"
        bind:value={userQuery} 
        placeholder="Type your question..." 
        class="w-full rounded-md border border-blue-400 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-300 placeholder-blue-400 bg-white/80 shadow-md"
        on:keydown={(e) => e.key === 'Enter' && sendQuery()}
      />
      
      <button 
        on:click={sendQuery}
        disabled={$isLoading} 
        class="w-full rounded-md bg-gradient-to-r from-blue-400 to-blue-600 p-3 text-white font-semibold hover:from-blue-500 hover:to-blue-700 transform hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if $isLoading}
          <span class="inline-block animate-pulse">Loading...</span>
        {:else}
          Ask Now
        {/if}
      </button>
      
      {#if $error}
        <div class="p-3 bg-red-100 border border-red-300 rounded-md text-red-600 text-sm">
          {$error}
        </div>
      {/if}
      
      <div class="mt-6 p-4 rounded-md border border-blue-300 bg-white shadow-md space-y-3">
        {#each $chatHistory as chat}
          <div class="blu text-blue-600 font-medium max-w-none">
            {@html md.render(chat.message)}
          </div>
        {/each}
      </div>
      
    </div>
  </div>
</div>

<style>
:global(.blu) {
  color: #3b82f6; 
  font-weight: 700;
}
</style>
