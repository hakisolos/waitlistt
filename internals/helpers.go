package internals

import (
	"database/sql"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type WaitlistReq struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

func Home(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "api running",
	})
}

func addToWaitlist(user WaitlistReq) error {
	if user.Email == "" {
		return errors.New("email is required")
	}

	db, err := Conndb()
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec(`INSERT INTO emails (email) VALUES ($1)`, user.Email)
	return err
}

func AddToWaitlist(c *gin.Context) {
	var user WaitlistReq

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "bad request",
		})
		return
	}

	db, err := Conndb()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "an error occurred",
		})
		return
	}
	defer db.Close()

	var existingID int
	err = db.QueryRow(`SELECT id FROM emails WHERE email = $1`, user.Email).Scan(&existingID)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error": "this email has already joined the waitlist",
		})
		return
	}

	if err != nil && err != sql.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "an error occurred while checking waitlist",
			"details": err.Error(),
		})
		return
	}

	if err := addToWaitlist(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "an error occurred while adding to waitlist",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "successfully joined waitlist",
	})
}

func GetWaitlistEmail(c *gin.Context) {
	db, err := Conndb()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "an error occurred while connecting to database",
			"details": err.Error(),
		})
		return
	}
	defer db.Close()

	rows, err := db.Query(`SELECT id, email, created_at FROM emails`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "an error occurred while fetching waitlist emails",
			"details": err.Error(),
		})
		return
	}
	defer rows.Close()

	var waitlist []WaitlistReq

	for rows.Next() {
		var w WaitlistReq

		if err := rows.Scan(&w.ID, &w.Email, &w.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "an error occurred while reading waitlist emails",
				"details": err.Error(),
			})
			return
		}

		waitlist = append(waitlist, w)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "an error occurred while iterating waitlist emails",
			"details": err.Error(),
		})
		return
	}

	if len(waitlist) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "no email in waitlist yet",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "waitlist fetched successfully",
		"data":    waitlist,
	})
}
