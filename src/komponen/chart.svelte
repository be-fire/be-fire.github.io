<script>
  export let semua_data = [];

  import { onMount } from "svelte";
  import { Line } from "svelte-chartjs";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  } from "chart.js";

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  );

  function calculateMovingAverages(data) {
    // pakai yang ini
    // nanti ambil semua_data
    // const result = {
    //   data_asli: data,
    //   moving_average_7: [],
    //   moving_average_30: [],
    // };

    let datanya = data;

    let ma7 = [];
    let ma30 = [];

    for (let i = 0; i < data.length; i++) {
      // Hitung moving average 7
      const movingAverage7 = calculateAverage(
        data.slice(Math.max(0, i - 6), i + 1),
      );

      // Hitung moving average 30
      const movingAverage30 = calculateAverage(
        data.slice(Math.max(0, i - 29), i + 1),
      );

      ma7.push(movingAverage7);
      ma30.push(movingAverage30);

      //   result.moving_average_7.push(movingAverage7);
      //   result.moving_average_30.push(movingAverage30);
    }

    for (let n in datanya) {
      datanya[n].ma7 = ma7[n];
      datanya[n].ma30 = ma30[n];
    }

    return datanya;
  }

  function calculateAverage(subarray) {
    if (subarray.length === 0) {
      return 0;
    }

    const sum = subarray.reduce(
      (total, dataPoint) => total + dataPoint.banyaknya,
      0,
    );
    return sum / subarray.length;
  }

  // let semua_data = [];
  // if (localStorage.semua_data) {
  //   semua_data = JSON.parse(localStorage.semua_data);
  // }

  let tanggalan = new Date();
  // tanggalan = new Date("2023-11-03");
  let tanggal = tanggalan.getDate();

  if (semua_data.length > 0) {
    let cek_tanggal_terakhir = semua_data[semua_data.length - 1].tanggal;
    let sisipan_tanggal = [];
    if (
      tanggal - cek_tanggal_terakhir > 0 &&
      cek_tanggal_terakhir != 28 &&
      cek_tanggal_terakhir != 29 &&
      cek_tanggal_terakhir != 30 &&
      cek_tanggal_terakhir != 31
    ) {
      // console.log("mulai")
      let selisih_tanggal = tanggal - cek_tanggal_terakhir;
      // console.log(selisih_tanggal)
      for (let n = 0; n < selisih_tanggal; n++) {
        sisipan_tanggal = [
          ...sisipan_tanggal,
          {
            tanggal: +cek_tanggal_terakhir + +n + 1,
            banyaknya: 0,
          },
        ];
      }
    }
    semua_data = [...semua_data, ...sisipan_tanggal];
  }

  let datanya = calculateMovingAverages(semua_data).slice(-30);
  console.log(datanya);

  let labels = [];
  let banyaknya = [];
  let ma7 = [];
  let ma30 = [];
  for (let x of datanya) {
    labels.push(x.tanggal);
    banyaknya.push(x.banyaknya);
    ma7.push(x.ma7);
    ma30.push(x.ma30);
  }

  let data = {
    labels,
    datasets: [
      {
        label: "Pencapaian",
        data: banyaknya, // Data untuk line 1
        borderColor: "red",
        fill: false,
      },
      // {
      //   label: "Rata-Rata Seminggu",
      //   data: ma7, // Data untuk line 2
      //   borderColor: "green",
      //   fill: false,
      // },
      // {
      //   label: "Rata-Rata Sebulan",
      //   data: ma30, // Data untuk line 3
      //   borderColor: "blue",
      //   fill: false,
      // },
    ],
  };

  onMount(() => {
    // Isi data.labels dan data.datasets[n].data dengan data yang sesuai
  });
</script>

<div>
  <Line {data} />
</div>

<style>
  /* Gaya CSS untuk elemen chart jika diperlukan */
</style>
