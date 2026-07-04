# Casino Theme Studio

A Chrome/Edge extension concept that composes a new Impossible Casino site
from live game metadata, images, and links.

This is no longer an overlay theme. The toolbar opens a controlled local
extension page that uses a live source site for components and content,
then orchestrates those pieces into a new branded frontend.

## Features

- Opens a standalone Impossible Casino concept site.
- Uses local SPA-style navigation for Home, My Casino, Games, Live Casino,
  Bingo, Lotteries, Promotions, and Account areas.
- Harvests Casino, Live Casino, and Bingo games from source pages.
- Uses real game names, providers, images, and play links.
- Rebuilds the homepage and section pages with a controlled hero, navigation,
  cards, promotions, and grouped provider-style lobby carousels.
- Lets each lobby carousel switch between carousel and grid with View all.
- Includes a fuller My Casino builder with custom carousels, search, source and
  provider filters, drag-to-carousel, drag-to-reorder, and remove controls.
- Caches the latest harvested catalogue locally for quick reloads.
- Sends game clicks back to the matching game routes.

## Install

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select this folder.
5. Click the extension toolbar icon.

The concept does not change account data or source content. It uses a live site
as a data and asset source for a locally controlled prototype.
