---
title: "How do .epubs work?"
date: 2020-02-13T03:29:13Z
---

There are a couple of different file formats that e-books are distributed in.
The one I most commonly see is the EPUB format, which has the `.epub` file
extension. Let's take a look at the internals of this file this format.

## An example EPUB

In this article, we'll be looking at a copy of Moby Dick, published by the
website [Planet Ebook](https://www.planetebook.com/). You can download the EPUB
[from this page](https://www.planetebook.com/moby-dick/). N.B: you should check
that this book is in the public domain and out of copyright in your country
before downloading.

## EPUBs are zip files

We can see their contents by unzipping them:

```sh
$ unzip moby-dick.epub
$ rm moby-dick.epub  # We don't need this anymore
$ tree
.
├── META-INF
│   ├── com.apple.ibooks.display-options.xml
│   ├── container.xml
│   └── encryption.xml
├── OEBPS
│   ├── Moby-Dick.xhtml
│   ├── content.opf
│   ├── cover.xhtml
│   ├── css
│   │   └── idGeneratedStyles.css
│   ├── font
│   │   ├── MinionPro-BoldDisp.otf
│   │   ├── MinionPro-CnIt.otf
│   │   ├── MinionPro-MediumDisp.otf
│   │   └── MinionPro-Regular.otf
│   ├── image
│   │   ├── 1.png
│   │   └── Moby-Dick.jpg
│   └── toc.ncx
└── mimetype
```

## EPUBs are similar to websites

We can see a couple of filetypes we'd expect to see in a website:

- `xhtml`, which defines the content of pages
- `css`, which defines styling
- `otf`, which are font files
- `png`/`jpg` which are images
- `mimetype`, which specifies the nature and format of a file

## MIMEtype

```sh
$ cat mimetype
application/epub+zip
```

This file provies a more reliable way of telling that this file is actually an
EPUB than the `.epub` file extension. All EPUBs must have an
`application/epub+zip` MIMEtype

# META-INF

The `META-INF` directory contains metadata about the book. The only required
file here is `container.xml`. This file points to the file which contains the
contents of the book:

```xml
<!-- META-INF/container.xml -->
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>
```

We can see that the content of the book is stored at `OEBPS/content.opf`

## Document layout

`OEBPS/content.opf` is an Open Packaging Format file. It's an XML document with
a particular format used to define the contents of EPUBs:

```xml
<!-- OEBPS/content.opf -->
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<package version="2.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <meta name="generator" content="Adobe InDesign 12.1" />
    <meta name="cover" content="x1.png" />
    <dc:title>Moby-Dick</dc:title>
    <dc:date>2018-02-20T05:18:46Z</dc:date>
    <dc:language>en-US</dc:language>
    <dc:identifier id="bookid">urn:uuid:29d919dd-24f5-4384-be78-b447c9dc299b</dc:identifier>
  </metadata>
  <manifest>
    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml" />
    <item id="Moby-Dick" href="Moby-Dick.xhtml" media-type="application/xhtml+xml" />
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />
    <item id="idGeneratedStyles.css" href="css/idGeneratedStyles.css" media-type="text/css" />
    <item id="Moby-Dick.jpg" href="image/Moby-Dick.jpg" media-type="image/jpeg" />
    <item id="x1.png" href="image/1.png" media-type="image/png" />
    <item id="MinionPro-Regular.otf" href="font/MinionPro-Regular.otf"
      media-type="application/vnd.ms-opentype" />
    <!-- other fonts -->
  </manifest>
  <spine toc="ncx">
    <itemref idref="cover" linear="no" />
    <itemref idref="Moby-Dick" />
  </spine>
  <guide>
    <reference type="cover" href="cover.xhtml" title="Cover" />
  </guide>
</package>
```

Let's look at each of the sections:

- Metadata. The author, title, language etc of the book
- Manifest. The list of files that make up the book
- Spine. The order in which items should be displayed in the book
- Guide.
  "[A set of references to fundamental structural features of the publication, such as table of contents, foreword, bibliography, etc.](http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.0)".
  To be honest, I'm not sure how this differs from the `spine` section

When reading the book, you'll see the `cover`, defined in `OEBPS/cover.xhtml`,
then the main content `Moby-Dick`, defined in `OEBPS.Moby-Dick.xhtml`.

## Table of contents

The table of contents is defined in the NCX (Navigation Control file for XML)
file `OEBPS/toc.ncx`:

```xml
<!-- OEBPS/toc.ncx -->
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN"
  "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid"
      content="urn:uuid:29d919dd-24f5-4384-be78-b447c9dc299b" />
    <meta name="dtb:depth" content="3" />
    <meta name="dtb:totalPageCount" content="0" />
    <meta name="dtb:maxPageNumber" content="0" />
  </head>
  <docTitle>
    <text>Moby-Dick</text>
  </docTitle>
  <navMap>
    <navPoint id="navpoint1" playOrder="1">
      <navLabel><text>Moby Dick </text></navLabel>
      <content src="Moby-Dick.xhtml#_idParaDest-1" />
      <navPoint id="navpoint2" playOrder="2">
        <navLabel><text>ETYMOLOGY.</text></navLabel>
        <content src="Moby-Dick.xhtml#_idParaDest-2" />
        <navPoint id="navpoint3" playOrder="3">
          <navLabel><text>Chapter 1 Loomings.</text></navLabel>
          <content src="Moby-Dick.xhtml#_idParaDest-3" />
        </navPoint>
        <!-- other chapters -->
      </navPoint>
    </navPoint>
  </navMap>
</ncx>
```

The `content` tags in this file link to the relevant places in the main text.

## Cover

This is just an HTML file which displays a full page image

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
  "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>cover</title>
  </head>
  <body>
    <div style="text-align:center;">
      <img src="image/1.png" alt="1.png" style="max-width:100%;" />
    </div>
  </body>
</html>
```

## Content

This is another HTML file which contains the actual text of the book. Chapter
headings are marked with `id`s that match the URL fragment in `OEBPS/toc.ncx`.
