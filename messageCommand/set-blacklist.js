const { PermissionsBitField } = require("discord.js");
const { prefix } = require("../config.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "b-role",
    async execute(message, args, client) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply({ content: "ليست لديك الصلاحيات الكافية لاستخدام هذا الامر", ephemeral: true });
    }
        
        let role = message.mentions.roles.first();
        
        if (!role) {
            return message.reply(`${prefix}b-role + منشن للرتبة`);
        }

        const blacklistFilePath = path.join('blacklist.json');
        let blacklistData = {};

        if (fs.existsSync(blacklistFilePath)) {
            blacklistData = JSON.parse(fs.readFileSync(blacklistFilePath));
        }

        if (!blacklistData[message.guild.id]) {
            blacklistData[message.guild.id] = role.id;
            fs.writeFileSync(blacklistFilePath, JSON.stringify(blacklistData, null, 4));
            return message.reply(`تم تحديد الرتبة بنجاح`);
        } else {
            return message.reply(`تم تحديد هذه الرتبة بالفعل`);
        }
    },
};
