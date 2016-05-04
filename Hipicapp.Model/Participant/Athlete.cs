﻿using FluentNHibernate.Mapping;
using Hipicapp.Model.Abstract;
using Hipicapp.Model.Account;
using Hipicapp.Model.Event;
using Hipicapp.Model.File;
using Hipicapp.Utils.Util;
using Hipicapp.Utils.Validator;
using Newtonsoft.Json;
using NHibernate.Validator.Constraints;
using System;
using Unne.Utils.Date;

namespace Hipicapp.Model.Participant
{
    [JsonObject]
    public class Athlete : Entity<long?>
    {
        //[NotNull]
        //[Min(0)]
        public virtual long? CategoryId { get; set; }

        public virtual long? PhotoId { get; set; }

        //[NotNull]
        //[Min(0)]
        public virtual long? UserId { get; set; }

        [NotNull]
        [NotEmpty]
        [Nif]
        [SafeHtml(WhiteListType.NONE)]
        public virtual string Dni { get; set; }

        [NotNull]
        [NotEmpty]
        [Size(Max = ValidationUtils.MAX_LENGTH_DEFAULT)]
        [SafeHtml(WhiteListType.NONE)]
        public virtual string Name { get; set; }

        [NotNull]
        [NotEmpty]
        [Size(Max = ValidationUtils.MAX_LENGTH_DEFAULT)]
        [SafeHtml(WhiteListType.NONE)]
        public virtual string Surnames { get; set; }

        [NotNull]
        public virtual Gender? Gender { get; set; }

        [NotNull]
        [Past]
        public virtual DateTime? BirthDate { get; set; }

        [NotNull]
        [Min(0)]
        public virtual float? Weight { get; set; }

        public virtual CompetitionCategory Category { get; set; }

        public virtual FileInfo Photo { get; set; }

        [Valid]
        public virtual User User { get; set; }

        public virtual long? Age
        {
            get
            {
                return DateUtils.GetAgeExactInYears(this.BirthDate);
            }
        }
    }

    public class AthleteMap : EntityMap<Athlete, long?>
    {
        public AthleteMap()
        {
            Table("ATHLETE");
            Cache.NonStrictReadWrite();

            Id(x => x.Id).Column("ID").GeneratedBy.Native();

            Map(x => x.CategoryId).Column("CATEGORY_ID").Not.Nullable();
            Map(x => x.PhotoId).Column("PHOTO_ID").Nullable();
            Map(x => x.UserId).Column("USER_ID").Not.Nullable();
            Map(x => x.Dni).Column("DNI").Not.Nullable().Unique();
            Map(x => x.Name).Column("NAME").Not.Nullable();
            Map(x => x.Surnames).Column("SURNAMES");
            Map(x => x.Gender).Column("GENDER").CustomType<GenericEnumMapper<Gender>>().Not.Nullable();
            Map(x => x.BirthDate).Column("BIRTH_DATE").CustomType("Date");
            Map(x => x.Weight).Column("WEIGHT").Not.Nullable();

            References<CompetitionCategory>(x => x.Category).Column("CATEGORY_ID").Fetch.Join().Not.LazyLoad().ReadOnly();
            References<FileInfo>(x => x.Photo).Column("PHOTO_ID").NotFound.Ignore().LazyLoad().Fetch.Join().ReadOnly();
            References<User>(x => x.User).Column("USER_ID").Fetch.Join().Not.LazyLoad().ReadOnly();
        }
    }
}