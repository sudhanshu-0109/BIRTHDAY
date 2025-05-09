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
    imgElement.src = images[index];
    currentIndex = index;
  }
  
  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
  
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
  });
  
