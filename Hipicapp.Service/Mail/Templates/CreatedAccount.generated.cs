﻿#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     Este código fue generado por una herramienta.
//     Versión de runtime:4.0.30319.42000
//
//     Los cambios en este archivo podrían causar un comportamiento incorrecto y se perderán si
//     se vuelve a generar el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ASP
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    
    #line 3 "..\..\Mail\Templates\CreatedAccount.cshtml"
    using Hipicapp.Service.Mail.Models;
    
    #line default
    #line hidden
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "2.0.0.0")]
    public partial class _Mail_Templates_CreatedAccount_cshtml : RazorGenerator.Templating.RazorTemplateBase
    {
#line hidden

        #line 5 "..\..\Mail\Templates\CreatedAccount.cshtml"

    public CreatedAccountEmailModel message;

        #line default
        #line hidden

        public override void Execute()
        {


WriteLiteral("\r\n\r\n");


WriteLiteral("\r\n");


WriteLiteral(@"

<html>
<head>
    <title>Restablecer contraseña | Hipicapp</title>
</head>
<body>
    <p>Estimado/a Atleta,</p>
    <p>Ha solicitado que se restablezca su contraseña. Haga clic</p>
    <p>en el siguiente vínculo. Le llevará a una página web de</p>
    <p>Hipicapp en la que podrá cambiar la contraseña.</p>
    <p><a href=""");


            
            #line 18 "..\..\Mail\Templates\CreatedAccount.cshtml"
           Write(message.Url);

            
            #line default
            #line hidden
WriteLiteral("\">Restablecer contraseña</a></p>\r\n    <p>Gracias,</p>\r\n    <p>El equipo de cuenta" +
"s de Hipicapp</p>\r\n</body>\r\n</html>");


        }
    }
}
#pragma warning restore 1591
