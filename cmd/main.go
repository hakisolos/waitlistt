package main

import (
	"github.com/gin-gonic/gin"
	"github.com/hakisolos/waitlist/internals"
)

func main() {
	r := gin.Default()
	r.GET("/", internals.Home)
	r.POST("/waitlist/join", internals.AddToWaitlist)
	r.GET("/waitlist/get", internals.GetWaitlistEmail)
	r.Run(":4000")

}
