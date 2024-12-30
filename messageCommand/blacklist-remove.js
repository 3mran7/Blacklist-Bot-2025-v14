const { PermissionsBitField } = require("discord.js");
const { prefix } = require("../config.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "b-remove", //هنا تحط اي امر تبغاه مو شرط هذا
    async execute(message, args, client) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply({ content: "ليست لديك الصلاحيات الكافية لاستخدام هذا الامر", ephemeral: true });
    }
        
        let user = message.mentions.users.first();

        if (!user) {
            return message.reply(`${prefix}b-remove + منشن العضو`);
        }

        const blacklistFilePath = path.join('blacklist.json');

        if (!fs.existsSync(blacklistFilePath)) {
            return message.reply("ملف البلاك ليست غير موجود");
        }

        let blacklistData = JSON.parse(fs.readFileSync(blacklistFilePath));

        const roleId = blacklistData[message.guild.id];
        if (!roleId) {
            return message.reply("لم يتم تحديد رتبة البلاك ليست في السيرفر");
        }

        const role = message.guild.roles.cache.get(roleId);
        if (!role) {
            return message.reply("الرتبة التي تم تحديدها من قبل غير موجودة");
        }

        try {
            await message.guild.members.fetch(user.id);
            const member = message.guild.members.cache.get(user.id);


            await member.roles.remove(role);
            message.reply(`${user.username} has been unblacklisted`);
        } catch (error) {
            message.reply("حدث خطا اثناء استخدام الامر");
            console.error(error);
        }
    },
};
