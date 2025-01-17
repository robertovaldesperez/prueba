﻿using Hipicapp.Model.File;
using Hipicapp.Model.Participant;
using Hipicapp.Repository.Participant;
using Hipicapp.Services.File;
using Hipicapp.Utils.Pager;
using Spring.Objects.Factory.Attributes;
using Spring.Stereotype;
using Spring.Transaction.Interceptor;
using System.Linq;

namespace Hipicapp.Service.Participant
{
    [Service]
    public class HorseService : IHorseService
    {
        [Autowired]
        private IEnrollmentRepository EnrollmentRepository { get; set; }

        [Autowired]
        private IHorseRepository HorseRepository { get; set; }

        [Autowired]
        private IFileService FileService { get; set; }

        [Transaction(ReadOnly = true)]
        public Page<Horse> Paginated(HorseFindFilter filter, PageRequest pageRequest)
        {
            return HorseRepository.Paginated(HorsePredicates.ValueOf(filter, this.HorseRepository.GetAllQueryable()), pageRequest);
        }

        [Transaction(ReadOnly = true)]
        public Page<Horse> PaginatedByCurrentUser(HorseFindFilter filter, PageRequest pageRequest)
        {
            var page = this.HorseRepository.Paginated(HorsePredicates.ValueOf(filter, this.HorseRepository.GetAllQueryable()), pageRequest);

            page.Content.ToList().ForEach(x =>
            {
                x.Assign = this.EnrollmentRepository.GetAllQueryable().Any(y => y.Id.HorseId == x.Id && y.Id.CompetitionId == filter.CompetitionId) ? x.Id : null;
            });

            return page;
        }

        [Transaction(ReadOnly = true)]
        public Horse Get(long? id)
        {
            return this.HorseRepository.Get(id);
        }

        [Transaction]
        public Horse Save(Horse horse)
        {
            HorseRepository.Save(horse);
            return horse;
        }

        [Transaction]
        public Horse Update(Horse horse)
        {
            var model = this.HorseRepository.Get(horse.Id);
            model.Name = horse.Name;
            model.Weight = horse.Weight;
            model.Height = horse.Height;
            model.BirthDate = horse.BirthDate;
            model.Gender = horse.Gender;
            this.HorseRepository.Update(model);
            return model;
        }

        [Transaction]
        public Horse Delete(Horse horse)
        {
            HorseRepository.Delete(this.HorseRepository.Get(horse.Id));
            return horse;
        }

        [Transaction]
        public FileInfo Upload(Horse horse, string name, string mimeType, byte[] bytes)
        {
            long? previousPhotoId = horse.PhotoId;

            FileInfo newPhotoFileInfo = this.FileService.Save(name, mimeType, bytes);

            horse.PhotoId = newPhotoFileInfo.Id;
            horse.Photo = newPhotoFileInfo;

            this.HorseRepository.Update(horse);

            if (previousPhotoId != null)
            {
                this.FileService.Delete(previousPhotoId);
            }

            return newPhotoFileInfo;
        }
    }
}