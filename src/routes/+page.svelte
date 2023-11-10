<script>
	import Chartnya from '../komponen/chart.svelte';
	import slug from '../fungsi/slug';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let reset = false;

	if (browser) {
		window.addEventListener('resize', () => (reset = !reset));
	}

	let listnya = [];
	if (browser) {
		if (localStorage.listnya) {
			listnya = JSON.parse(localStorage.listnya);
		} else {
			localStorage.listnya = JSON.stringify([]);
		}
	}

	function tambahkan_baru(input_baru) {
		let ada = false;
		if (listnya.length > 0) {
			for (let x of listnya) {
				if (x.judul.toLowerCase() == input_baru.toLowerCase()) {
					ada = true;
				}
			}
		}
		if (ada == false) {
			listnya = [
				...listnya,
				{
					id: crypto.randomUUID(),
					judul: input_baru,
					slug: slug(input_baru),
					data: [] // tanggal, banyaknya
				}
			];
			localStorage.listnya = JSON.stringify(listnya);
			input_baru = '';
		} else {
			input_baru = '';
		}
		reset = !reset;
	}

	function tambah() {
		let namanya = prompt('Enter Quest Name\nSeparate with commas if you wanna create quests');
		if (namanya) {
			if (namanya.includes(',')) {
				let list_baru = namanya.split(',').map((x) => x.trim());
				let banyaknya_list_baru = list_baru.length;
				for (let x of list_baru) {
					tambahkan_baru(x);
				}
				if (banyaknya_list_baru % 2 == 0) {
					reset = !reset;
				}
			} else {
				tambahkan_baru(namanya);
			}
		}
	}

	function tambahkan(id, selisih) {
		if (browser) {
			let listnya_scoped = JSON.parse(localStorage.listnya);
			let terpilih = listnya_scoped.find((x) => x.id == id);

			let tanggalan = new Date();
			// tanggalan = new Date("2023-11-03");
			let tanggal = tanggalan.getDate();

			let semua_data = terpilih.data;
			if (semua_data.length > 0 && semua_data[semua_data.length - 1].tanggal == tanggal) {
				semua_data[semua_data.length - 1].banyaknya += selisih;
			} else {
				if (semua_data.length > 0) {
					let cek_tanggal_terakhir = semua_data[semua_data.length - 1].tanggal;
					let sisipan_tanggal = [];
					if (
						tanggal - cek_tanggal_terakhir > 1 &&
						cek_tanggal_terakhir != 28 &&
						cek_tanggal_terakhir != 29 &&
						cek_tanggal_terakhir != 30 &&
						cek_tanggal_terakhir != 31
					) {
						let selisih_tanggal = tanggal - cek_tanggal_terakhir;
						for (let n = 1; n < selisih_tanggal; n++) {
							sisipan_tanggal = [
								...sisipan_tanggal,
								{
									tanggal: +cek_tanggal_terakhir + +n,
									banyaknya: 0
								}
							];
						}
					}
					semua_data = [
						...semua_data,
						...sisipan_tanggal,
						{
							tanggal,
							banyaknya: selisih
						}
					];
				} else {
					semua_data = [
						{
							tanggal,
							banyaknya: selisih
						}
					];
				}
			}
			terpilih.data = semua_data;
			reset = !reset;
			listnya = [...listnya_scoped];
			localStorage.listnya = JSON.stringify(listnya_scoped);
		}
	}

	function edit({ id, judul }) {
		let tanyain = prompt("Modify Title (Write 'delete' to delete it)", judul);
		if (tanyain) {
			let listnya_ambil = JSON.parse(localStorage.listnya);
			if (tanyain == 'delete') {
				let list_baru = listnya_ambil.filter((x) => x.id != id);
				localStorage.listnya = JSON.stringify(list_baru);
				listnya = list_baru;
				reset = !reset;
			} else {
				let ambil = [...listnya_ambil.filter((x) => x.id == id)][0];
				ambil.judul = tanyain;
				console.log(ambil);

				let hapus_dulu = [...listnya_ambil].filter((x) => x.id != id);
				let list_baru = [...hapus_dulu, ambil];

				localStorage.listnya = JSON.stringify(list_baru);
				listnya = list_baru;
				reset = !reset;
			}
		}
	}
</script>

<div class="p-3 grid grid-cols-1 gap-3">
	{#key reset}
		<div class="grid grid-cols-4 gap-3">
			{#if browser}
				{#each [...JSON.parse(localStorage.listnya)].sort( (a, b) => (a.judul > b.judul ? 1 : -1) ) as x (x.id)}
					<div>
						<div class="bg-base-100">
							<Chartnya semua_data={x.data} />
						</div>
						<div class="card card-compact w-full bg-base-100">
							<div class="card-body">
								<button
									class="card-title text-center block select-none cursor-pointer"
									on:click={() =>
										edit({
											id: x.id,
											judul: x.judul
										})}
								>
									{x.judul}
								</button>
								<div class="flex justify-between">
									<button
										class="btn btn-circle"
										on:click={() => {
											tambahkan(x.id, -1);
										}}>➖</button
									>
									<button>
										{#if x.data.length > 0 && x.data[x.data.length - 1].tanggal == new Date().getDate()}
											{x.data[x.data.length - 1].banyaknya}
										{:else}
											0
										{/if}
									</button>
									<button class="btn btn-circle" on:click={() => tambahkan(x.id, 1)}>➕</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{/key}
</div>
<button class="btn btn-circle btn-primary fixed bottom-2 right-2" on:click={tambah}>➕</button>
