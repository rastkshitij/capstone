import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

dns.lookup("abc.localhost", (err, address) => {
    console.log(err);
    console.log(address);
});