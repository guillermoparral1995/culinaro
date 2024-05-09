document.querySelector('#change-image-container')?.addEventListener('click', () => (document.querySelector('#change-image') as HTMLInputElement)?.click());

let newImage: ArrayBuffer | undefined;
document.querySelector('#change-image')?.addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = readerEvent => {
            newImage = readerEvent?.target?.result as ArrayBuffer | undefined;
        }
    }
})

const form = document.querySelector('form')!;
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const userId = form.getAttribute('data-userid')!;
    const username = (document.querySelector('#username') as HTMLInputElement).value;
    const bio = (document.querySelector('#bio') as HTMLInputElement).value;
    formData.append('id', userId);
    if (username) {
        formData.append('username', username);
    }
    if (bio) {
        formData.append('bio', bio);
    }
    if (newImage) {
        formData.append('image', new Blob([newImage], { type: 'image/jpeg' }));
    }

    try {
        const res = await fetch('/api/user.json', {
            method: 'PUT',
            body: formData
        });
        console.log(await res.json())
    } catch (e) {
        console.log(e)
    }

    // window.location.href = '/profile/your-info';
});