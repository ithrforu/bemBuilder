[
  '<!DOCTYPE html>',
  {
    block: 'page',
    tag: 'html',
    attrs: {
      lang: 'en'
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
              content: 'Vova'
            }
          },
          {
            tag: 'meta',
            attrs: {
              name: 'description',
              content: 'Second page'
            }
          },
          {
            tag: 'title',
            content: 'Second page'
          },
          {
            tag: 'link',
            attrs: {
              rel: 'stylesheet',
              href: 'css/pets.min.css'
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
            block: 'block3',
            tag: 'p',
            content: 'Hello! This is second page.'
          },
          {
            tag: 'script',
            attrs: {
              src: 'js/pets.min.js'
            }
          }
        ]
      }
    ]
  }
]