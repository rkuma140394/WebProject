let imgBox = document.getElementById("imgBox");
let qrImage = document.getElementById("qrImage");
let qrText = document.getElementById("qrText");
let downloadBtn = document.getElementById("downloadBtn");

qrText.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        generateQR();
    }
});

function generateQR() {
    const value = qrText.value.trim();

    if (value.length > 0) {
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(value)}`;
        imgBox.classList.add("show-img");
        qrText.classList.remove("error");
        downloadBtn.disabled = false;
    } else {
        qrText.classList.add("error");
        setTimeout(() => {
            qrText.classList.remove("error");
        }, 1000);
    }
}

async function downloadQR() {
    if (!qrImage.src) {
        qrText.classList.add("error");
        setTimeout(() => {
            qrText.classList.remove("error");
        }, 1000);
        return;
    }

    try {
        const response = await fetch(qrImage.src);
        if (!response.ok) {
            throw new Error("Unable to download the QR code right now.");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "qr-code.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        alert(error.message);
    }
}
