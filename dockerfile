# 使用Go官方镜像作为构建环境
FROM golang:1.18 as builder

# 设置工作目录
WORKDIR /app

# 复制Go模块依赖文件
COPY go.mod ./

# 下载Go模块依赖
RUN go mod download

# 复制项目文件到工作目录
COPY . .

# 构建Go应用
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# 使用alpine镜像作为最终镜像的基础
FROM alpine:latest

# 在alpine中安装ca-certificates，以便可以使用HTTPS
RUN apk --no-cache add ca-certificates

# 设置工作目录
WORKDIR /root/

# 从构建器镜像中复制构建好的应用
COPY --from=builder /app/main .

# 复制Source文件夹和index.html到镜像中
COPY --from=builder /app/Source ./Source

# 暴露端口
EXPOSE 8080

# 运行应用
CMD ["./main"]