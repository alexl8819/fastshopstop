<script setup lang="ts">
    import { ref, computed } from 'vue';

	import { type InventoryItem } from '../inventory';
	import { Category, getCategory } from '../category';

	enum SortMethod {
		Default = 0,
		PriceAsc = 1,
		PriceDesc = 2,
		StockDesc = 3
	};

    const props = defineProps({
        items: Array<InventoryItem>
    });

	const curFilter = ref<string>('all');
	const curSortMethod = ref<SortMethod>(SortMethod.Default); // todo: use string instead
	const searchInput = ref<string>('');

	const filterSortItems = computed(() => {
		let filtered: Array<InventoryItem> | undefined = props.items;
		
		// Filter
		if (searchInput.value && searchInput.value.length > 0) {
			filtered = props.items?.filter((item) => item.title.toLowerCase().includes(searchInput.value.toLowerCase()));
		} else if ((!searchInput.value.length) && curFilter.value.toLowerCase() === Category.Collectables.description?.toLowerCase()) {
			filtered = props.items?.filter((item) => getCategory(item.categorySku) === Category.Collectables);
		} else if ((!searchInput.value.length) && curFilter.value.toLowerCase() === Category.Electronics.description?.toLowerCase()) {
			filtered = props.items?.filter((item) => getCategory(item.categorySku) === Category.Electronics);
		} else if ((!searchInput.value.length) && curFilter.value.toLowerCase() === Category.Sportswear.description?.toLowerCase()) {
			filtered = props.items?.filter((item) => getCategory(item.categorySku) === Category.Sportswear);
		}

		// Sort
		if (curSortMethod.value === SortMethod.Default) {
			return filtered?.sort((itemA, itemB) => (itemB.timeLeft as Date).getMilliseconds() - (itemA.timeLeft as Date).getMilliseconds());
		} else if (curSortMethod.value === SortMethod.PriceAsc) {
			return filtered?.sort((itemA, itemB) => itemA.price - itemB.price);
		} else if (curSortMethod.value === SortMethod.PriceDesc) {
			return filtered?.sort((itemA, itemB) => itemB.price - itemA.price);
		} else if (curSortMethod.value === SortMethod.StockDesc) {
			return filtered?.sort((itemA, itemB) => itemB.quantity - itemA.quantity);
		}

		return filtered;
	});

	function changeFilter (newFilter: string): void {
		curFilter.value = newFilter.toLowerCase();
		searchInput.value = '';
	}

	function changeSort (newSort: string | null): void {
		if (!newSort) {
			throw new Error('Sort must be defined');
		}

		switch (newSort.toLowerCase()) {
			case 'price-asc':
				curSortMethod.value = SortMethod.PriceAsc;
				break;
			case 'price-desc':
				curSortMethod.value = SortMethod.PriceDesc;
				break;
			case 'stock-desc':
				curSortMethod.value = SortMethod.StockDesc;
				break;
			default:
				curSortMethod.value = SortMethod.Default;
				break;
		}
	}

	function getSortValue (sortedEnum: SortMethod): string {
		switch (sortedEnum) {
			case SortMethod.PriceAsc:
				return 'price-asc';
			case SortMethod.PriceDesc:
				return 'price-desc';
			case SortMethod.StockDesc:
				return 'stock-desc';
			default:
				return 'default';
		}
	}
</script>

<template>
    <div id="app">
        <div class="flex gap-3.5 flex-wrap items-center justify-between mb-7.5 py-4.5 px-5 bg-(--navy) border-3 border-(--ink) shadow-(--shadow)">
    		<div class="flex gap-2.5 flex-wrap items-center">
      			<button rel="button" class="font-ibm-plex-mono text-[12px] py-2 px-3.5 border-2 tracking-[0.02em] cursor-pointer" :class="{
					'outline-none': curFilter !== 'all',
					'outline-3': curFilter === 'all',
					'outline-(--ink)': curFilter === 'all',
					'bg-(--gold)': curFilter === 'all',
					'bg-transparent': curFilter !== 'all',
					'border-(--gold)': curFilter === 'all',
					'border-(--paper)': curFilter !== 'all',
					'text-(--navy)': curFilter === 'all',
					'text-(--paper)': curFilter !== 'all',
					'font-semibold': curFilter === 'all'
				}" @click="changeFilter('all')">
					All
				</button>
      			<button rel="button" class="font-ibm-plex-mono text-[12px] py-2 px-3.5 border-2 tracking-[0.02em] cursor-pointer" :class="{
					'outline-none': curFilter !== Category.Collectables.description?.toLowerCase(),
					'outline-3': curFilter === Category.Collectables.description?.toLowerCase(),
					'outline-(--ink)': curFilter === Category.Collectables.description?.toLowerCase(),
					'bg-(--gold)': curFilter === Category.Collectables.description?.toLowerCase(),
					'bg-transparent': curFilter !== Category.Collectables.description?.toLowerCase(),
					'border-(--gold)': curFilter === Category.Collectables.description?.toLowerCase(),
					'border-(--paper)': curFilter !== Category.Collectables.description?.toLowerCase(),
					'text-(--navy)': curFilter === Category.Collectables.description?.toLowerCase(),
					'text-(--paper)': curFilter !== Category.Collectables.description?.toLowerCase(),
					'font-semibold': curFilter === Category.Collectables.description?.toLowerCase()
				}" @click="changeFilter('collectables')">
					Collectables
				</button>
      			<button rel="button" class="font-ibm-plex-mono text-[12px] py-2 px-3.5 border-2 tracking-[0.02em] cursor-pointer" :class="{
					'outline-none': curFilter !== Category.Electronics.description?.toLowerCase(),
					'outline-3': curFilter === Category.Electronics.description?.toLowerCase(),
					'outline-(--ink)': curFilter === Category.Electronics.description?.toLowerCase(),
					'bg-(--gold)': curFilter === Category.Electronics.description?.toLowerCase(),
					'bg-transparent': curFilter !== Category.Electronics.description?.toLowerCase(),
					'border-(--gold)': curFilter === Category.Electronics.description?.toLowerCase(),
					'border-(--paper)': curFilter !== Category.Electronics.description?.toLowerCase(),
					'text-(--navy)': curFilter === Category.Electronics.description?.toLowerCase(),
					'text-(--paper)': curFilter !== Category.Electronics.description?.toLowerCase(),
					'font-semibold': curFilter === Category.Electronics.description?.toLowerCase()
				}" @click="changeFilter('electronics')">
					Electronics
				</button>
      			<button rel="button" class="font-ibm-plex-mono text-[12px] py-2 px-3.5 border-2 tracking-[0.02em] cursor-pointer" :class="{
					'outline-none': curFilter !== Category.Sportswear.description?.toLowerCase(),
					'outline-3': curFilter === Category.Sportswear.description?.toLowerCase(),
					'outline-(--ink)': curFilter === Category.Sportswear.description?.toLowerCase(),
					'bg-(--gold)': curFilter === Category.Sportswear.description?.toLowerCase(),
					'bg-transparent': curFilter !== Category.Sportswear.description?.toLowerCase(),
					'border-(--gold)': curFilter === Category.Sportswear.description?.toLowerCase(),
					'border-(--paper)': curFilter !== Category.Sportswear.description?.toLowerCase(),
					'text-(--navy)': curFilter === Category.Sportswear.description?.toLowerCase(),
					'text-(--paper)': curFilter !== Category.Sportswear.description?.toLowerCase(),
					'font-semibold': curFilter === Category.Sportswear.description?.toLowerCase()
				}" @click="changeFilter('sportswear')">
					Sportswear
				</button>
    		</div>
    		<div class="flex gap-2.5 flex-wrap items-center">
      			<div class="flex items-center gap-2 bg-(--paper) border-2 border-(--ink) py-2 px-3 min-w-55">
        			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#171B22" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        			<input type="text" id="search" class="border-none bg-transparent outline-none font-ibm-plex-mono text-[13px] w-full text-(--ink)" placeholder="Search for sunglasses" v-model="searchInput">
      			</div>
      			<select :value="getSortValue(curSortMethod)" class="font-ibm-plex-mono text-[12px] py-2.25 px-2.5 border-2 border-(--paper) bg-(--navy) text-(--paper)" id="sort" @change="changeSort($event.target?.value)">
        			<option value="default">Sort: Newest In</option>
        			<option value="price-asc">Price: Low → High</option>
        			<option value="price-desc">Price: High → Low</option>
        			<option value="stock-desc">Stock: Most First</option>
      			</select>
    		</div>
  		</div>

  		<p class="font-ibm-plex-mono text-[12px] text-[#9AA3B2] mb-4.5" id="result-count">{{ filterSortItems?.length }} items shown</p>

        <div v-if="filterSortItems?.length === 0" class="grid-cols-[1/-1] text-center py-17.5 px-5 font-ibm-plex-mono text-[#6b6f78]">
            <p>Nothing on the shelf matches that. Try another search.</p>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(255px,1fr))] gap-4" v-else>
            <div class="bg-(--paper) border-2 border-(--ink) relative flex flex-col shadow-(--shadow) animate-riseIn" v-for="item in filterSortItems">
				<div class="h-4 w-full" :class="{ 
					'bg-(--purple)': getCategory(item.categorySku) === Category.Collectables,
					'bg-(--teal)': getCategory(item.categorySku) === Category.Electronics,
					'bg-(--gold)': getCategory(item.categorySku) === Category.Sportswear
				}"></div>
				<div class="h-37.5 flex items-center justify-center border-b-2 border-dashed border-(--ink) relative overflow-hidden" :class="{
					'bg-(--purple-dim)': getCategory(item.categorySku) === Category.Collectables,
					'bg-(--teal-dim)': getCategory(item.categorySku) === Category.Electronics,
					'bg-(--gold-dim)': getCategory(item.categorySku) === Category.Sportswear
				}">
					<span class="absolute top-2.5 right-2.5 font-ibm-plex-mono text-[10px] font-bold tracking-[0.08em] uppercase py-1 px-2 border-2 rotate-[8deg] bg-[rgba(233,228,212,0.92)]" :class="{
						'text-(--ok-green)': item.quantity !== item.quantitySold,
						'border-(--ok-green)': item.quantity !== item.quantitySold,
						'text-[#8a8a8a]': item.quantity === item.quantitySold,
						'border-[#8a8a8a]': item.quantity === item.quantitySold
					}">
						{{ item.quantity === item.quantitySold ? 'Sold Out' : 'In Stock' }}
					</span>
					<img class="h-full w-full object-cover aspect-square" :src="item.mainScreenshot" :alt="item.title" />
				</div>
				<div class="pt-4 px-4 pb-4.5 flex flex-col gap-2 flex-1">
					<span class="font-ibm-plex-mono text-[10px] tracking-widest uppercase text-[#6b6f78]">{{ getCategory(item.categorySku).description }}</span>
					<div class="font-archivo-black text-[15px] leading-tight">{{  item.title }}</div>
					<p class="text-[12.5px] text-[#4A4E58] leading-[1.45] max-h-8 truncate">{{ item.description }}</p>
					<div class="flex justify-between items-center mt-1 font-ibm-plex-mono text-[11px] text-[#6b6f78]">
						<span>SKU {{ item.categorySku }}</span>
						<span>{{ item.condition }}</span>
					</div>
					<div class="my-2 text-[12.5px] text-[#6b6f78] text-center font-ibm-plex-mono">
						Expires <span class="font-semibold">{{ item.expiration }}</span>
					</div>
					<div class="flex items-center justify-between mt-2.5 border-t border-dashed border-t-(--ink) pt-3">
						<span class="font-ibm-plex-mono text-[19px] font-semibold">${{ item.price.toFixed(2) }}</span>
						<button rel="button" v-if="item.quantitySold === item.quantity" class="inline-flex items-center gap-1.5 decoration-[none] bg-(--ink) text-(--paper) font-ibm-plex-mono text-[11.5px] font-semibold py-2.25 px-3 tracking-[0.02em] transition-colors" :class="{
							'disabled:cursor-not-allowed': item.quantitySold === item.quantity,
							'disabled:opacity-45': item.quantitySold === item.quantity,
							'disabled:bg-[#8a8a8a]': item.quantitySold === item.quantity
						}" :disabled="item.quantitySold === item.quantity">
							Sold Out
						</button>
						<a class="inline-flex items-center gap-1.5 decoration-[none] bg-(--ink) text-(--paper) font-ibm-plex-mono text-[11.5px] font-semibold py-2.25 px-3 tracking-[0.02em] transition-colors hover:bg-(--stamp-red) hover:transform hover:-translate-px" 
							:href="item.listingUrl" target="_blank" rel="noopener" v-else>
							View on eBay
						</a>
					</div>
				</div>
			</div>
        </div>
    </div>
</template>