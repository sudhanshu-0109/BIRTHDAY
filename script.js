const images = [
  'images/photo1.jpg',
  'images/photo2.jpg',
  'images/photo3.jpg',
  'images/photo4.jpg',
  'images/photo5.jpg',
  'images/photo6.jpg',
  'images/photo7.jpg',
  'images/photo8.jpg',
  'images/photo9.jpg',
  'images/photo10.jpg',
  'images/photo11.jpg',
  'images/photo12.jpg',
];

let currentIndex = 0;
const imgElement = document.getElementById('slideshow-image');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

function showImage(index) {
  if (index < 0) index = images.length - 1;
  if (index >= images.length) index = 0;
  imgElement.classList.remove('fade');
  void imgElement.offsetWidth; // force reflow
  imgElement.src = images[index];
  imgElement.classList.add('fade');
  currentIndex = index;
}

prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
  if (event.key === 'ArrowRight') showImage(currentIndex + 1);
});

// Optional: Swipe support for mobile
let startX = 0;
imgElement.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
imgElement.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) showImage(currentIndex + 1); // swipe left
  if (endX - startX > 50) showImage(currentIndex - 1); // swipe right
});

  
