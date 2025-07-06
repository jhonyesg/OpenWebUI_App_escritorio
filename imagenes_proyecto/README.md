# Arquivos de exemplo para colocar nas capturas de tela

Esta pasta contém capturas de tela e imagens que demonstram as funcionalidades da aplicação OpenWeb UI Desktop.

## Capturas de tela sugeridas:

### 1. screenshot_principal.png
- Captura da tela principal da aplicação
- Deve mostrar a interface do OpenWeb UI carregada
- Tamanho recomendado: 1200x800px

### 2. config_editor.png / editor_configuracion.png
- Captura do editor de configuração
- Deve mostrar os campos de configuração preenchidos
- Deve incluir a seção de padrões de notificação
- Tamanho recomendado: 600x600px

### 3. pantalla_principal.png
- Vista geral da aplicação em funcionamento
- Pode ser similar ao screenshot_principal.png
- Deve mostrar uma sessão ativa do OpenWeb UI

### 4. notificaciones.png
- Demonstração do sistema de notificações
- Pode incluir logs do terminal mostrando o sistema funcionando
- Ou uma captura da notificação sendo exibida

### 5. menu_aplicacion.png
- Captura do menu da aplicação
- Deve mostrar os menus "Arquivo", "Ver", "Ajustes"
- Tamanho recomendado: captura parcial focando no menu

## Como capturar screenshots:

### Linux (usando gnome-screenshot):
```bash
# Captura de tela completa
gnome-screenshot -f screenshot_principal.png

# Captura de uma janela específica
gnome-screenshot -w -f config_editor.png

# Captura de uma área selecionada
gnome-screenshot -a -f notificaciones.png
```

### Alternativas no Linux:
```bash
# Com scrot
scrot screenshot_principal.png
scrot -s config_editor.png  # selecionar área

# Com imagemagick
import screenshot_principal.png
```

### Windows:
- Use a ferramenta Snipping Tool
- Ou Ferramenta de Recorte nativa

### macOS:
- Cmd+Shift+3 (tela completa)
- Cmd+Shift+4 (área selecionada)
- Cmd+Shift+4+Space (janela específica)

## Dicas para boas capturas:

1. **Resolução**: Use resolução alta para qualidade
2. **Conteúdo**: Mostre funcionalidades reais, não apenas telas em branco
3. **Contexto**: Inclua elementos que demonstrem a funcionalidade
4. **Tamanho**: Otimize o tamanho do arquivo para web (PNG para interfaces, JPG para fotos)
5. **Consistência**: Use o mesmo tema/aparência em todas as capturas

## Formatos recomendados:
- **PNG**: Para capturas de interface (melhor qualidade para texto)
- **JPG**: Para imagens com muitas cores/gradientes
- **Tamanho máximo**: 2MB por imagem para GitHub

## Processamento de imagens:

Para otimizar as imagens após capturar:

```bash
# Redimensionar com ImageMagick
convert screenshot_principal.png -resize 1200x800 screenshot_principal.png

# Otimizar PNG
optipng screenshot_principal.png

# Converter para JPG se necessário
convert screenshot_principal.png -quality 85 screenshot_principal.jpg
```
