require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const axios = require('axios');
const moment = require('moment');
const { ks, sys, ovh, locations } = require('./config.js');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASS,
    database : process.env.MYSQL_DBNAME
});

moment.locale('fr');

async function api3(planCode) {
    let res = await axios.get('https://www.ovh.com/engine/apiv6/dedicated/server/datacenter/availabilities/?planCode=' + planCode);
    if (res.status !== 200) return null;
    let data = res.data;
    const list = {};
    if (data === undefined) return {};
    if (data[0] === undefined) return {};
    if (data[0].datacenters === undefined) return {};
    for (let i = 0; i < data.length; i++) {
        for (let f = 0; f < data[i].datacenters.length; f++) {
            list[data[i].datacenters[f].datacenter] = data[i].datacenters[f].availability;
        }
    }
    return list;
}

async function api2(planCode) {
    let res = await axios.get('https://www.ovh.com/engine/apiv6/dedicated/server/datacenter/availabilities/?planCode=' + planCode);
    if (res.status !== 200) return null;
    let data = res.data;
    const list = {};
    if (data === undefined) return {};
    if (data[0] === undefined) return {};
    if (data[0].datacenters === undefined) return {};
    for (let i = 0; i < data[0].datacenters.length; i++) {
        list[data[0].datacenters[i].datacenter] = data[0].datacenters[i].availability;
    }
    return list;
}

async function api1(planCode) {
    let res = await axios.get('https://www.ovh.com/engine/api/dedicated/server/availabilities?country=eu&hardware=' + planCode);
    if (res.status !== 200) return null;
    let data = res.data;
    const list = {};
    if (data === undefined) return {};
    if (data[0] === undefined) return {};
    if (data[0].datacenters === undefined) return {};
    for (let i = 0; i < data.length; i++) {
        for (let f = 0; f < data[i].datacenters.length; f++) {
            list[data[i].datacenters[f].datacenter] = data[i].datacenters[f].availability;
        }
    }
    return list;
}

async function getKs() {
    const list = {};
    for (let j = 0; j < Object.keys(ks).length; j++) {
        if (ks[Object.keys(ks)[j]].length === 1) {
            list[Object.keys(ks)[j]] = [await api2(ks[Object.keys(ks)[j]][0])];
        } else if (ks[Object.keys(ks)[j]].length === 2) {
            list[Object.keys(ks)[j]] = [await api2(ks[Object.keys(ks)[j]][0]),await api2(ks[Object.keys(ks)[j]][1])];
        }
    }

    const embed = new MessageEmbed()
        .setTitle("Kimsufi")
        .setColor('#10ac84')
        .setDescription('État des stocks disponible auprès de Kimsufi \n 🇫🇷 France - 🇨🇦 Canada')
        .setFooter(`Mis à jour le ${moment().format('LLLL')}`);

    for (let k = 0; k < Object.keys(list).length; k++) {
        if (ks[Object.keys(list)[k]].length === 1) {
            let data = ''
            if (list[Object.keys(list)[k]][0]['gra'] !== undefined && locations.ks.gra) {
                data += `🇫🇷 Gravelines${(list[Object.keys(list)[k]][0]['gra'] !== 'unavailable' ? process.env.EMOJI_AVAILABLE : process.env.EMOJI_UNAVAILABLE)}`
            }
            if (list[Object.keys(list)[k]][0]['rbx'] !== undefined && locations.ks.rbx) {
                data += `\n🇫🇷 Roubaix${(list[Object.keys(list)[k]][0]['rbx'] !== 'unavailable' ? process.env.EMOJI_AVAILABLE : process.env.EMOJI_UNAVAILABLE)}`
            }
            embed.addField(Object.keys(list)[k], data, true);
        } else if (ks[Object.keys(ks)[k]].length === 2) {
            let data = ''
            if (list[Object.keys(list)[k]][0]['gra'] !== undefined && locations.ks.gra) {
                data += `🇫🇷 Gravelines${(list[Object.keys(list)[k]][0]['gra'] !== 'unavailable' ? process.env.EMOJI_AVAILABLE : process.env.EMOJI_UNAVAILABLE)}`
            }
            if (list[Object.keys(list)[k]][0]['rbx'] !== undefined && locations.ks.rbx) {
                data += `\n🇫🇷 Roubaix${(list[Object.keys(list)[k]][0]['rbx'] !== 'unavailable' ? process.env.EMOJI_AVAILABLE : process.env.EMOJI_UNAVAILABLE)}`
            }
            if (list[Object.keys(list)[k]][1]['bhs'] !== undefined && locations.ks.bhs) {
                data += `\n🇨🇦 Beauharnois${(list[Object.keys(list)[k]][1]['bhs'] !== 'unavailable' ? process.env.EMOJI_AVAILABLE : process.env.EMOJI_UNAVAILABLE)}`
            }
            embed.addField(Object.keys(list)[k], data, true);
        }
    }

    return embed;
}

async function getSys() {
    const list = {};
    for (let j = 0; j < Object.keys(sys).length; j++) {
        list[Object.keys(sys)[j]] = [await api1(sys[Object.keys(sys)[j]][0]),await api1(sys[Object.keys(sys)[j]][1])];
    }

    const embed = new MessageEmbed()
        .setTitle("SoYouStart")
        .setColor('#10ac84')
        .setDescription('État des stocks disponible auprès de SoYouStart \n 🇫🇷 France - 🇨🇦 Canada')
        .setFooter(`Mis à jour le ${moment().format('LLLL')}`);

    for (let k = 0; k < Object.keys(list).length; k++) {
        let data = ''
        if (list[Object.keys(list)[k]][0]['gra'] !== undefined && locations.sys.gra) {
            data += `🇫🇷 Gravelines${(list[Object.keys(list)[k]][0]['gra'] !== 'unavailable' ? process.env.EMOJI_AVAILABLE : process.env.EMOJI_UNAVAILABLE)}`
        }
        if (list[Object.keys(list)[k]][0]['rbx'] !== undefined && locations.sys.rbx) {
            data += `\n🇫🇷 Roubaix${(list[Object.keys(list)[k]][0]['rbx'] !== 'unavailable' ? process.env.EMOJI_AVAILABLE : process.env.EMOJI_UNAVAILABLE)}`
        }
        if (list[Object.keys(list)[k]][1]['bhs'] !== undefined && locations.sys.bhs) {
            data += `\n🇨🇦 Beauharnois${(list[Object.keys(list)[k]][1]['bhs'] !== 'unavailable' ? process.env.EMOJI_AVAILABLE : process.env.EMOJI_UNAVAILABLE)}`
        }
        embed.addField(Object.keys(list)[k], data, true);
    }

    return embed;
}

async function getOvh() {
    const list = {};
    for (let j = 0; j < Object.keys(ovh).length; j++) {
        list[Object.keys(ovh)[j]] = [await api3(ovh[Object.keys(ovh)[j]][0])];
    }

    const embed = new MessageEmbed()
        .setTitle("OVH")
        .setColor('#10ac84')
        .setDescription('État des stocks disponible auprès d\'OVH \n 🇫🇷 France 🇨🇦 Canada 🇩🇪 Allemagne')
        .setFooter(`Mis à jour le ${moment().format('LLLL')}`);

    for (let k = 0; k < Object.keys(list).length; k++) {
        let data = ''
        if (list[Object.keys(list)[k]][0]['gra'] !== undefined && locations.ovh.gra) {
            data += `🇫🇷 Gravelines${(list[Object.keys(list)[k]][0]['gra'] !== 'unavailable' ? process.env.EMOJI_AVAILABLE : process.env.EMOJI_UNAVAILABLE)}`
        }
        if (list[Object.keys(list)[k]][0]['rbx'] !== undefined && locations.ovh.rbx) {
            data += `\n🇫🇷 Roubaix${(list[Object.keys(list)[k]][0]['rbx'] !== 'unavailable' ? process.env.EMOJI_AVAILABLE : process.env.EMOJI_UNAVAILABLE)}`
        }
        if (list[Object.keys(list)[k]][0]['bhs'] !== undefined && locations.ovh.bhs) {
            data += `\n🇨🇦 Beauharnois${(list[Object.keys(list)[k]][0]['bhs'] !== 'unavailable' ? process.env.EMOJI_AVAILABLE : process.env.EMOJI_UNAVAILABLE)}`
        }
        if (list[Object.keys(list)[k]][0]['fra'] !== undefined && locations.ovh.fra) {
            data += `\n🇩🇪 Francfort${(list[Object.keys(list)[k]][0]['fra'] !== 'unavailable' ? process.env.EMOJI_AVAILABLE : process.env.EMOJI_UNAVAILABLE)}`
        }
        embed.addField(Object.keys(list)[k], data, true);
    }

    return embed;
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    await connection.query('SELECT * from data', function (error, results, fields) {
        if (error) console.log(error);
        const data = JSON.parse(JSON.stringify(results));
        for (let j = 0; j < data.length; j++) {
            let guild = client.guilds.cache.get(data[j].guild_id);
            if (guild) {
                let channel_ovh = guild.channels.cache.get(data[j].channel_ovh);
                let channel_sys = guild.channels.cache.get(data[j].channel_sys);
                let channel_ks = guild.channels.cache.get(data[j].channel_ks);
                channel_ks.messages.fetch(data[j].embed_ks).then(async msg => msg.edit(await getKs()));
                channel_sys.messages.fetch(data[j].embed_sys).then(async msg => msg.edit(await getSys()));
                channel_ovh.messages.fetch(data[j].embed_ovh).then(async msg => msg.edit(await getOvh()));
                setInterval (function () {
                    channel_ks.messages.fetch(data[j].embed_ks).then(async msg => msg.edit(await getKs()));
                    channel_sys.messages.fetch(data[j].embed_sys).then(async msg => msg.edit(await getSys()));
                    channel_ovh.messages.fetch(data[j].embed_ovh).then(async msg => msg.edit(await getOvh()));
                }, 300000);
            }
        }
    });
});

client.on('message', async message => {
    if (!message.content.startsWith('!') || message.author.bot) return;
    const args = message.content.slice('!'.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'config') {
        const embed = new MessageEmbed().setTitle('Attente de création...').setDescription('Veuillez patientez, le système est en train de préparer les informations');
        let channel_ovh = message.guild.channels.cache.get(args[0]);
        const ovh = await channel_ovh.send(embed);
        let channel_sys = message.guild.channels.cache.get(args[1]);
        const sys = await channel_sys.send(embed);
        let channel_ks = message.guild.channels.cache.get(args[2]);
        const ks = await channel_ks.send(embed);
        connection.query('INSERT INTO data SET ?', {guild_id: message.guild.id, channel_ovh: args[0], embed_ovh: ovh.id, channel_sys: args[1], embed_sys: sys.id, channel_ks: args[2], embed_ks: ks.id}, function (error, results, fields) {
            if (error) throw error;
        });
        channel_ks.messages.fetch(ks.id).then(async msg => msg.edit(await getKs()));
        channel_sys.messages.fetch(sys.id).then(async msg => msg.edit(await getSys()));
        channel_ovh.messages.fetch(ovh.id).then(async msg => msg.edit(await getOvh()));
        setInterval (function () {
            channel_ks.messages.fetch(ks.id).then(async msg => msg.edit(await getKs()));
            channel_sys.messages.fetch(sys.id).then(async msg => msg.edit(await getSys()));
            channel_ovh.messages.fetch(ovh.id).then(async msg => msg.edit(await getOvh()));
        }, 300000);
        message.channel.send('Bot configuré !').then(msg => {
            msg.delete({timeout: 3000});
        });
    }
});

client.login(process.env.DISCORD_TOKEN);