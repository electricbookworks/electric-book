---
title: Add and replace images
categories:
  - Electric Book Manager
order: 5
---

# Adding and replacing images
{:.no_toc}

* Page contents
{:toc}

You must provide separate images for each output format that you want to produce. Each format may have different image requirements. Our template comes with six folders for images, which correspond to output formats: `print-pdf`, `screen-pdf`, `web`, `app`, and `epub`, and a `_source` folder for storing master versions of images.

Each folder should contain the same set of images, formatted appropriately for each format. For instance, while their file names must be identical, web images might be full-colour, 96dpi, and up to 800 pixels wide; while print-pdf images might be in greyscale, 300dpi and 2400 pixels wide. And your _source images may be full-colour and 600dpi. For more on image optimization, see [Images](../editing/images.html).

For a professional conversion service, you can also contact [Fire and Lion](https://fireandlion.com).

## Adding images

1. From the dashboard, click on the project you would like to add images to. This take redirect you to the project detail page.
2. Click ‘Image Files’. This will take you to a ‘Files’ page.
3. Once you have optimized images for each format, drag and drop one image at a time from your computer onto the screen. This will prompt you to enter a path name for where the image must be stored. Remember that path names depend on what format the image is for. For example, a publisher logo for the print book (if your folder containing the book is indeed called `book`, which is the template default for the first book) would be `book/images/print-pdf/publisher-logo.jpg`; and for web outupt it would be `book/images/web/publisher-logo.jpg`; and your hi-res source image would go into `book/images/_source/publisher-logo.jpg`; and so on for `epub`, `screen-pdf` and `app`.
4. Once you have entered the path and clicked ‘Okay’, near the bottom of the page you should see a message pop up that says ‘Image uploaded’.
5. To return to the detail page, click the name of the project at the top of the screen. Once on the detail page, make sure to click 'Commit' to store your images in version-control and sync them to your GitHub account.

## Replacing images

1. From the dashboard, click on the project you would like to change images in. This will take you to the detail page.
2. Click ‘Image Files’. This will take you to a ‘Files’ page.
3. Use the search bar to find the image you would like to replace. For instance, if you want to replace the publisher logo for the print-pdf, your search might be for `book/images/print-pdf/publisher-logo.jpg` or just `logo`.
4. Once you can see the image you want to replace, drag and drop the new image *on top* of the original image.
5. You should see the image file update and a message pop up at the bottom of the screen saying ‘Image uploaded’.
5. To return to the detail page, click the name of the project at the top of the screen. Once on the detail page, make sure to click 'Commit' to store your images in version-control and sync them to your GitHub account.
