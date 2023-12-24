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

func BuildAppleTpl(wg *sync.WaitGroup) {
	defer wg.Done()
	now := time.Now()
	fileUrl := "https://raw.githubusercontent.com/geekdada/surge-list/master/surgio-snippet/apple.tpl"
	resp, err := http.Get(fileUrl)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	out, err := os.Create("./Source/tpl/apple.tpl")
	if err != nil {
		panic(err)
	}
	defer out.Close()

	scanner := bufio.NewScanner(resp.Body)
	lines := make([]string, 0)
	for scanner.Scan() {
		line := scanner.Text()
		// fmt.Println(line)
		if !strings.HasPrefix(line, "# http") && strings.TrimSpace(line) != "" {
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
	fmt.Printf("Build apple tpl time: %v\n", elapsed)
}
