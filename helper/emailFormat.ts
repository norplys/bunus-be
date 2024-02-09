const formatEmail = (name: string, token: string) => {
  return `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2;">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #FE7A36; ">
      <a href="" style="font-size:1.4em;color: #FF9843;text-decoration:none;font-weight:600">Bubur Nusantara</a>
    </div>
    <p style="font-size:1.1em">Halo,${name}</p>
    <p>Terimakasih telah mendaftar menjadi pelanggan kami,<br/>silahkan tekan tombol dibawah ini untuk memverifikasi email anda</p>
    <p>
    <a href="https://bunus.vercel.app/" style="background: #E55604;margin: 0 auto;width: max-content;padding: 10px 10px;color: #fff;border-radius: 4px;">Tekan Disini</a>
    <p style="font-size:0.9em;">Silahkan abaikan email ini atau beritahu kami jika anda tidak meminta email ini</p>
    <hr style="border:none;border-top:1px solid #FE7A36" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Bubur Nusantara</p>
      <p>Jalan Taman Surya 3 Blok J1/18</p>
      <p>Jakarta Barat</p>
    </div>
  </div>
</div>`;
};

export { formatEmail };
