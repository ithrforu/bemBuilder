[
  '<!DOCTYPE html>',
  {
    tag: 'html',
    attrs: {
      lang: 'ru'
    },
    content: [
      {
        tag: 'head',
        content: [
          {
            tag: 'meta',
            attrs: {
              charset: 'utf-8'
            }
          },
          {
            tag: 'meta',
            attrs: {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1'
            }
          },
          {
            tag: 'meta',
            attrs: {
              'http-equiv': 'X-UA-Compatible',
              content: 'ie=edge'
            }
          },
          {
            tag: 'meta',
            attrs: {
              name: 'author',
              content: 'Vova Kolesnikov'
            }
          },
          {
            tag: 'meta',
            attrs: {
              name: 'description',
              content: 'Test page'
            }
          },
          {
            tag: 'title',
            content: 'New site'
          },
          {
            tag: 'link',
            attrs: {
              rel: 'stylesheet',
              href: 'css/index.min.css'
            }
          },
          {
            tag: 'link',
            attrs: {
              rel: 'shortcut icon',
              href: 'favicon.ico',
              type: 'image/x-icon'
            }
          }
        ]
      },
      {
        tag: 'body',
        content: [
          {
            block: 'block1',
            content: [
              {
                block: 'block',
                elem: 'image',
                tag: 'img',
                attrs: {
                  src: 'assets/images/cat.png',
                  alt: 'Cute cat',
                  title: 'This is cat'
                }
              },
              {
                elem: 'top'
              }
            ]
          },
          {
            block: 'block2'
          },
          {
            block: 'block3'
          },
          {
            tag: 'script',
            attrs: {
              src: 'js/index.min.js'
            }
          }
        ]
      }
    ]
  }
]