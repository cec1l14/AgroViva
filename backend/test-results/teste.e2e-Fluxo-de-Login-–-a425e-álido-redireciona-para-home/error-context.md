# Page snapshot

```yaml
- main [ref=e3]:
  - generic [ref=e4]:
    - heading "Login" [level=1] [ref=e5]
    - generic [ref=e6]:
      - textbox "usuario@gmail.com" [ref=e7]: teste@email.com
      - generic [ref=e8] [cursor=pointer]: 
    - generic [ref=e9]:
      - textbox "********" [ref=e10]: "123456"
      - generic [ref=e11] [cursor=pointer]: 
    - generic [ref=e12]:
      - generic [ref=e13]:
        - checkbox "Lembrar senha" [ref=e14]
        - text: Lembrar senha
      - link "Cadastrar-se" [ref=e15] [cursor=pointer]:
        - /url: cadastro.html
    - button "Entrar" [active] [ref=e16] [cursor=pointer]
```