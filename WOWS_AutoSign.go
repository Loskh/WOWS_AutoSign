package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strconv"

	"flag"
	"log"
	"net/http"
	"net/url"
)

type UserData struct {
	spa_id  string
	account string
	zoneid  string
}
type UserState struct {
	Signlist struct {
		SPFLAG int `json:"SP_FLAG"`
		SPTYPE int `json:"SP_TYPE"`
	} `json:"signlist"`
}
type SignState struct {
	State string `json:"state"`
}

func GetSignCounts(u UserData) (count int) {
	spa_id := u.spa_id
	account := u.account
	zoneid := u.zoneid
	account_base64 := base64.StdEncoding.EncodeToString([]byte(account))
	data := make(url.Values)
	data["jsonpcallback"] = []string{"jQuery"}
	data["useraccount"] = []string{spa_id}
	data["login"] = []string{account_base64}
	data["zoneid"] = []string{zoneid}
	data["marks"] = []string{"inside"}
	res, err := http.PostForm("http://inside.wows.kongzhong.com/inside/wotinside/signact/signinfo", data)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	resdata := string(body)
	jsondata := resdata[7 : len(resdata)-1]
	//	fmt.Println(jsondata)
	var signcounts UserState
	if err := json.Unmarshal([]byte(jsondata), &signcounts); err == nil {
		//		fmt.Println(signstate)
		//		fmt.Println(signstate.Signlist.SPFLAG)
		return signcounts.Signlist.SPTYPE
	} else {
		//		fmt.Println(err)
		return -1
	}
}
func Sign(u UserData) (state string) {
	spa_id := u.spa_id
	account := u.account
	zoneid := u.zoneid
	account_base64 := base64.StdEncoding.EncodeToString([]byte(account))
	data := make(url.Values)
	data["jsonpcallback"] = []string{"jQuery"}
	data["useraccount"] = []string{spa_id}
	data["login"] = []string{account_base64}
	data["zoneid"] = []string{zoneid}
	data["marks"] = []string{"inside"}
	res, err := http.PostForm("http://inside.wows.kongzhong.com/inside/wotinside/signact/sign", data)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	resdata := string(body)
	jsondata := resdata[7 : len(resdata)-1]
	//	fmt.Println(jsondata)
	var signstate SignState
	if err := json.Unmarshal([]byte(jsondata), &signstate); err == nil {
		//		fmt.Println(signstate)
		//		fmt.Println(signstate.Signlist.SPFLAG)
		return signstate.State
	} else {
		//		fmt.Println(err)
		return "-1"
	}
}
func CheckandSign(u UserData) {
	if GetSignCounts(u) < 22 {
		state := Sign(u)
		count := strconv.Itoa(GetSignCounts(u))
		if state == "1" {
			log.Println(u.spa_id + "签到成功,本月已签到" + count + "次")
		} else if state == "0" {
			log.Println(u.spa_id + "已经签到过了,本月已签到" + count + "次")
		} else {
			log.Println(u.spa_id + "签到失败,本月已签到" + count + "次")
		}
	} else {
		log.Println(u.spa_id + "已经完成本月的签到")
	}
}

func main() {
	var userfile string
	flag.StringVar(&userfile, "user", "userlist.json", "config file")
	flag.Parse()
	b, err := ioutil.ReadFile("userlist.json")
	if err != nil {
		fmt.Print(err)
	}
	var m map[string]map[string]string
	if err := json.Unmarshal(b, &m); err != nil {
		fmt.Println(err)
		return
	}
	var UserList []UserData
	for spa_id, n := range m {
		u := UserData{spa_id, n["account"], n["zoneid"]}
		UserList = append(UserList, u)
	}
	//	fmt.Println(len(UserList))
	for _, user := range UserList {
		//		fmt.Printf("spa_id=%s	account=%s	zoneid=%s\n", user.spa_id, user.account, user.zoneid)
		CheckandSign(user)
	}

}
