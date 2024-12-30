const { PermissionsBitField } = require("discord.js");
const { prefix } = require("../config.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "b-add", //هنا تحط اي امر تبغاه مو شرط هذا
    async execute(message, args, client) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply({ content: "ليست لديك الصلاحيات لاعطاء بلاك ليست", ephemeral: true });
    }
        
        let user = message.mentions.users.first();
        let reason = message.content.split(" ").slice(2).join(" ") || "no reason";

        if (!user) {
            return message.reply(`${prefix}b-add + ذكر السبب او بدونه +  منشن العضو`);
        }

        const blacklistFilePath = path.join('blacklist.json');

        if (!fs.existsSync(blacklistFilePath)) {
            return message.reply("ملف البلاك ليست ليس موجودا");
        }

        let blacklistData = JSON.parse(fs.readFileSync(blacklistFilePath));

        const roleId = blacklistData[message.guild.id];
        if (!roleId) {
            return message.reply("الرجاء تحديد رتبة البلاك ليست اولا");
        }

        const role = message.guild.roles.cache.get(roleId);
        if (!role) {
            return message.reply("لم يتم العثور على الرتبة الي تم تحديدها من قبل");
        }

        try {
                    await message.guild.members.fetch(user.id);
            const member = message.guild.members.cache.get(user.id);


            await member.roles.add(role);
            message.reply(`${user.username} تم وضعه في قائمة البلاك ليست`);
            user.send({ content: `انت ضمن قائمة البلاك ليست\nالسبب: ${reason}`})
        } catch (error) {
            message.reply("حدث خطا اثناء استخدام الامر");
            console.error(error);
        }
    },
};
