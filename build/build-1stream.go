package build

import (
	"bufio"
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

func Build1stream(wg *sync.WaitGroup) {
	defer wg.Done()
	now := time.Now()
	fileUrl := "https://raw.githubusercontent.com/1-stream/1stream-public-utils/main/stream.smartdns.list"
	resp, err := http.Get(fileUrl)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	out, err := os.Create("./List/non_ip/1stream.conf")
	if err != nil {
		panic(err)
	}
	defer out.Close()

	scanner := bufio.NewScanner(resp.Body)
	lines := make([]string, 0)
	for scanner.Scan() {
		line := scanner.Text()
		// fmt.Println(line)
		if strings.TrimSpace(line) != "" {
			if strings.HasPrefix(line, "# ---------- > China Media") {
				break
			}
			if strings.HasPrefix(line, "#nameserver") || strings.HasPrefix(line, "# nameserver") {
				continue
			}
			if !strings.HasPrefix(line, "#") && strings.HasPrefix(line, "nameserver") {
				line = strings.Split(line, "/")[1]
			}
			lines = append(lines, line)
		}
	}
	for i, line := range lines {
		if i == len(lines)-1 {
			_, err = out.WriteString(line)
			if err != nil {
				panic(err)
			}
		} else {
			_, err = out.WriteString(line + "\n")
			if err != nil {
				panic(err)
			}
		}
	}

	if err := scanner.Err(); err != nil {
		panic(err)
	}
	end := time.Now()
	elapsed := end.Sub(now)
	fmt.Printf("Build 1stream conf time: %v\n", elapsed)
}
