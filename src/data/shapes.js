export const shapes = [
  { id: 'circle', name: 'Circle' },
  { id: 'triangle', name: 'Triangle' },
  { id: 'diamond', name: 'Diamond' },
  { id: 'square', name: 'Square' },
  { id: 'rectangle', name: 'Rectangle' },
  { id: 'heart', name: 'Heart' },
  { id: 'star', name: 'Star' },
  { id: 'hexagon', name: 'Hexagon' },
  { id: 'badge', name: 'Badge' },
  { id: 'arch', name: 'Arch' },
  { id: 'speech', name: 'Speech Bubble' },
  { id: 'leaf', name: 'Leaf' },
]

export const shapePaths = {
  heart:
    'M400 706 C260 580 104 474 104 308 C104 205 178 132 278 132 C334 132 374 160 400 203 C426 160 466 132 522 132 C622 132 696 205 696 308 C696 474 540 580 400 706 Z',
  badge:
    'M400 74 C470 124 545 96 594 156 C642 215 720 224 722 303 C724 379 782 431 735 494 C690 555 711 631 641 665 C574 699 541 769 464 748 C392 729 329 774 272 721 C218 670 139 685 116 611 C94 540 24 505 58 433 C91 364 48 297 104 241 C159 186 159 108 236 93 C310 78 340 30 400 74 Z',
  arch:
    'M112 728 L112 360 C112 201 241 72 400 72 C559 72 688 201 688 360 L688 728 Z',
  speech:
    'M96 144 H704 Q752 144 752 192 V544 Q752 592 704 592 H458 L330 718 L348 592 H96 Q48 592 48 544 V192 Q48 144 96 144 Z',
  leaf:
    'M129 623 C194 277 465 109 707 95 C693 346 552 626 213 704 C260 558 391 421 542 285 C374 376 241 497 129 623 Z',
}

export const shapePolygons = {
  star: '400,70 486,286 718,286 530,421 602,650 400,515 198,650 270,421 82,286 314,286',
  hexagon: '400,70 684,235 684,565 400,730 116,565 116,235',
}
