package build

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
)

type EntryType string

const (
	Directory EntryType = "directory"
	File      EntryType = "file"
)

type TreeEntry struct {
	Type     EntryType
	Name     string
	Path     string
	Children []TreeEntry
}

func prioritySorter(entries []TreeEntry) {
	sort.Slice(entries, func(i, j int) bool {
		if entries[i].Type == Directory && entries[j].Type != Directory {
			return true
		}
		if entries[i].Type != Directory && entries[j].Type == Directory {
			return false
		}
		return entries[i].Name < entries[j].Name
	})
}

func walkDir(path string) ([]TreeEntry, error) {
	fileInfo, err := os.Stat(path)
	if err != nil {
		return nil, err
	}

	var entries []TreeEntry
	entry := TreeEntry{
		Name: fileInfo.Name(),
		Path: path,
	}

	if fileInfo.IsDir() {
		entry.Type = Directory
		files, err := os.ReadDir(path)
		if err != nil {
			return nil, err
		}

		for _, file := range files {
			children, err := walkDir(filepath.Join(path, file.Name()))
			if children[0].Name == ".gitkeep" {
				continue
			}
			if err != nil {
				return nil, err
			}
			entry.Children = append(entry.Children, children...)
		}
	} else {
		entry.Type = File
	}

	entries = append(entries, entry)
	return entries, nil
}

func walk(tree []TreeEntry) string {
	result := ""
	prioritySorter(tree)
	for _, entry := range tree {
		if entry.Type == Directory {
			result += fmt.Sprintf(`<li class="folder">%s`, entry.Name)
			result += "<ul>"
			result += walk(entry.Children)
			result += "</ul></li>"
		} else if entry.Name != "index.html" {
			result += fmt.Sprintf(`<li><a class="file directory-list-file" href="%s">%s</a></li>`, entry.Path, entry.Name)
		}
	}
	return result
}

// generateHtml 生成HTML页面
func generateHtml(tree []TreeEntry) string {
	html := `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Surge Ruleset Server | Tiiwoo (@Tiiwoo)</title>
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
    <link href="https://cdn.skk.moe/favicon.ico" rel="icon" type="image/ico">
    <link href="https://cdn.skk.moe/favicon/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180">
    <link href="https://cdn.skk.moe/favicon/android-chrome-192x192.png" rel="icon" type="image/png" sizes="192x192">
    <link href="https://cdn.skk.moe/favicon/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32">
    <link href="https://cdn.skk.moe/favicon/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16">
    <meta name="description" content="Tiiwoo 自用的 Surge 规则组">

    <link rel="stylesheet" href="https://cdn.skk.moe/ruleset/css/21d8777a.css" />

    <meta property="og:title" content="Surge Ruleset | Tiiwoo (@Tiiwoo)">
    <meta property="og:type" content="Website">
    <meta property="og:url" content="https://rules.tiiwoo.moe/">
    <meta property="og:image" content="https://cdn.skk.moe/favicon/android-chrome-192x192.png">
    <meta property="og:description" content="Tiiwoo 自用的 Surge 规则组">
    <meta name="twitter:card" content="summary">
    <link rel="canonical" href="https://rules.tiiwoo.moe/">
</head>
<body>
    <main class="container">
        <h1>Surge Ruleset Server</h1>
        <ul class="directory-list">`

	html += walk(tree)

	html += `</ul>
    </main>
</body>
</html>`

	return html
}

func BuildPublic() {
	tree, err := walkDir("Source")
	if err != nil {
		panic(err)
	}

	htmlContent := generateHtml(tree)
	out, err := os.Create("./index.html")
	if err != nil {
		panic(err)
	}
	_, err = io.WriteString(out, htmlContent)
	if err != nil {
		fmt.Println("Error writing HTML file:", err)
		os.Exit(1)
	}
}
