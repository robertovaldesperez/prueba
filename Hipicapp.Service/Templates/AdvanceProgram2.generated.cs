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
    
    #line 4 "..\..\Templates\AdvanceProgram.cshtml"
    using Hipicapp.Model.Event;
    
    #line default
    #line hidden
    
    #line 3 "..\..\Templates\AdvanceProgram.cshtml"
    using Hipicapp.Model.Participant;
    
    #line default
    #line hidden
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "2.0.0.0")]
    public partial class _Templates_AdvanceProgram_cshtml : RazorGenerator.Templating.RazorTemplateBase
    {
#line hidden

        #line 6 "..\..\Templates\AdvanceProgram.cshtml"

    public Competition competition;
    public IList<Enrollment> inscriptions;
    public IList<Seminary> seminary;

        #line default
        #line hidden

        public override void Execute()
        {


WriteLiteral("\r\n\r\n");



WriteLiteral("\r\n");


WriteLiteral("\r\n\r\n<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <title>Contenido del concurso</title>\r\n<" +
"/head>\r\n<body>\r\n    <h2>Datos generales del concurso</h2>\r\n    <table border=\"0\"" +
">\r\n        <tbody>\r\n            <tr>\r\n                <td>Nombre:</td>\r\n        " +
"        <td>");


            
            #line 23 "..\..\Templates\AdvanceProgram.cshtml"
               Write(competition.Name);

            
            #line default
            #line hidden
WriteLiteral("</td>\r\n            </tr>\r\n            <tr>\r\n                <td>Categoría:</td>\r\n" +
"                <td>");


            
            #line 27 "..\..\Templates\AdvanceProgram.cshtml"
               Write(competition.Category.Name);

            
            #line default
            #line hidden
WriteLiteral("</td>\r\n            </tr>\r\n            <tr>\r\n                <td>Disciplina:</td>\r" +
"\n                <td>");


            
            #line 31 "..\..\Templates\AdvanceProgram.cshtml"
               Write(competition.Specialty.Name);

            
            #line default
            #line hidden
WriteLiteral("</td>\r\n            </tr>\r\n            <tr>\r\n                <td>Fechas:</td>\r\n   " +
"             <td>");


            
            #line 35 "..\..\Templates\AdvanceProgram.cshtml"
               Write(competition.StartDate.Value.ToShortDateString());

            
            #line default
            #line hidden
WriteLiteral(" - ");


            
            #line 35 "..\..\Templates\AdvanceProgram.cshtml"
                                                                  Write(competition.EndDate.Value.ToShortDateString());

            
            #line default
            #line hidden
WriteLiteral("</td>\r\n            </tr>\r\n            <tr>\r\n                <td>Recinto:</td>\r\n  " +
"              <td>");


            
            #line 39 "..\..\Templates\AdvanceProgram.cshtml"
               Write(competition.Address);

            
            #line default
            #line hidden
WriteLiteral("</td>\r\n            </tr>\r\n        </tbody>\r\n    </table>\r\n\r\n    <h2>Miembros del " +
"jurado</h2>\r\n    <table border=\"0\">\r\n        <tbody>\r\n");


            
            #line 47 "..\..\Templates\AdvanceProgram.cshtml"
             foreach (Seminary judge in seminary)
            {

            
            #line default
            #line hidden
WriteLiteral("                <tr>\r\n                    <td>");


            
            #line 50 "..\..\Templates\AdvanceProgram.cshtml"
                   Write(judge.Judge.FullName);

            
            #line default
            #line hidden
WriteLiteral("</td>\r\n                </tr>\r\n");


            
            #line 52 "..\..\Templates\AdvanceProgram.cshtml"
            }

            
            #line default
            #line hidden
WriteLiteral("        </tbody>\r\n    </table>\r\n\r\n    <h2>Participantes</h2>\r\n    <table border=\"" +
"0\">\r\n        <tbody>\r\n");


            
            #line 59 "..\..\Templates\AdvanceProgram.cshtml"
             foreach (Enrollment enrollment in inscriptions)
            {

            
            #line default
            #line hidden
WriteLiteral("                <tr>\r\n                    <td>");


            
            #line 62 "..\..\Templates\AdvanceProgram.cshtml"
                   Write(enrollment.Horse.Athlete.FullName);

            
            #line default
            #line hidden
WriteLiteral("</td>\r\n                </tr>\r\n");


            
            #line 64 "..\..\Templates\AdvanceProgram.cshtml"
            }

            
            #line default
            #line hidden
WriteLiteral("        </tbody>\r\n    </table>\r\n</body>\r\n</html>");


        }
    }
}
#pragma warning restore 1591
