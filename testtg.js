setInterval(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    process.stdout.write(timeString);
}, 1000);